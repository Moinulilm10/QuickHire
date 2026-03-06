const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthModel = require("../models/auth.model");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "QUICKHIRE_SUPER_SECRET_KEY_2026";
// Token expires in 12 hours
const JWT_EXPIRES_IN = "12h";

exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await AuthModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await AuthModel.createUser({
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        role: user.role,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Find user by email
    const user = await AuthModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email. Please sign up first.",
      });
    }

    // Edge case: Google user trying to login with password
    if (user.authProvider === "google") {
      return res.status(403).json({
        success: false,
        message: "This account uses Google Sign-In. Please login with Google.",
      });
    }

    // Guard against null password (safety net)
    if (!user.password) {
      return res.status(403).json({
        success: false,
        message: "Invalid login method for this account.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        role: user.role,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = parseInt(req.user.userId);

    if (isNaN(userId)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid session" });
    }

    const user = await AuthModel.findUserById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        role: user.role,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
  try {
    const { token, intent } = req.body;

    if (!token || !intent) {
      return res.status(400).json({
        success: false,
        message: "Google token and intent (login/signup) are required",
      });
    }

    // Verify Google Token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user exists
    let user = await AuthModel.findUserByEmail(email);

    // Handle Edge Cases
    if (intent === "signup") {
      if (user) {
        return res.status(409).json({
          success: false,
          message: "Account already exists. Please login instead.",
        });
      }

      // Create user if signup and doesn't exist
      user = await AuthModel.createUser({
        email,
        name: name || email.split("@")[0],
        authProvider: "google",
      });
    } else if (intent === "login") {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No account found. Please sign up first.",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid intent specified.",
      });
    }

    // Generate standard JWT mimicking local login/signup
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.status(intent === "signup" ? 201 : 200).json({
      success: true,
      message:
        intent === "signup"
          ? "User registered successfully via Google"
          : "Google Login successful",
      token: jwtToken,
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        role: user.role,
        picture: user.picture,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to authenticate with Google." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      AuthModel.getAllUsers({ skip, take: limit }),
      AuthModel.countUsers(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = parseInt(req.user.userId);

    // Verify requester is an admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only admins can delete users",
      });
    }

    // Find the user to be deleted
    const userToDelete = await AuthModel.findUserById(parseInt(id));

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting other admins
    if (userToDelete.role === "ADMIN" && userToDelete.id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot delete other admin accounts",
      });
    }

    // Prevent self-deletion if preferred (optional, but safer for now)
    if (userToDelete.id === adminId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot delete your own account from here",
      });
    }

    await AuthModel.deleteUserDependencies(userToDelete.id);
    await AuthModel.deleteUserById(userToDelete.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = parseInt(req.user.userId);
    const { name } = req.body;

    const updateData = {};
    if (name) updateData.name = name;

    if (req.file) {
      updateData.picture = `/uploads/profiles/${req.file.filename}`;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided for update",
      });
    }

    const updatedUser = await AuthModel.updateUser(userId, updateData);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        uuid: updatedUser.uuid,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        picture: updatedUser.picture,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

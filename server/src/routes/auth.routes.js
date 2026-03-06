const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer config for profiles
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/profiles";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/google", authController.googleAuth);

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile);
router.put(
  "/profile",
  authMiddleware,
  upload.single("picture"),
  authController.updateProfile,
);
router.get("/users", authMiddleware, authController.getAllUsers);
router.delete("/users/:id", authMiddleware, authController.deleteUser);

module.exports = router;

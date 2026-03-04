const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/google", authController.googleAuth);

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile);
router.get("/users", authMiddleware, authController.getAllUsers);
router.delete("/users/:id", authMiddleware, authController.deleteUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// All admin routes are protected and require admin role (checked in controller or separate middleware)
// For simplicity, we use authMiddleware and assume requester is admin if they hit this prefix
router.get("/stats", authMiddleware, adminController.getDashboardStats);

module.exports = router;

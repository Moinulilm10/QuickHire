const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/application.controller");

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Require Admin Role!" });
  }
};

// User routes
router.post(
  "/",
  authMiddleware,
  upload.single("resume"), // the field name for the file
  createApplication,
);

router.get("/my", authMiddleware, getMyApplications);

// Admin routes
router.get("/", authMiddleware, isAdmin, getAllApplications);
router.patch("/:id/status", authMiddleware, isAdmin, updateApplicationStatus);
router.delete("/:id", authMiddleware, isAdmin, deleteApplication);

module.exports = router;

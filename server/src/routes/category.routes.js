const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

// Public (or user-facing) route without auth to get categories (e.g. for dropdowns)
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Protected Admin Routes
// We assume authMiddleware checks if the user is an admin or we have a separate admin middleware.
// Given the existing structure, we hook them up sequentially.
router.post("/", authMiddleware, categoryController.createCategory);
router.put("/:id", authMiddleware, categoryController.updateCategory);
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

module.exports = router;

const CategoryModel = require("../models/category.model");

exports.getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "";
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      CategoryModel.getAllCategoriesPaginated({
        skip,
        take: limit,
        search,
        sort,
      }),
      CategoryModel.countCategories({ search }),
    ]);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.getCategoryById(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Get Category By Id Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    // Check if category exists
    const existing = await CategoryModel.getCategoryByName(name);
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const category = await CategoryModel.createCategory(name);

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    // Check if new name conflicts with existing
    const existing = await CategoryModel.getCategoryByName(name);
    if (existing && existing.id !== parseInt(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Category name already in use" });
    }

    const category = await CategoryModel.updateCategory(id, name);

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Update Category Error:", error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await CategoryModel.deleteCategory(id);

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const Category = require('../models/CategoryModel');

const getAllCategories = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const categories = await Category.find({ user: req.user.id }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.create({
      name: name.trim(),
      user: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const result = await Category.deleteOne({ _id: req.params.id, user: req.user.id });

    if (!result.deletedCount) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = { getAllCategories, createCategory, deleteCategory };

const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');

const getAllProducts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const products = await Product.find({ user: req.user.id });

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const categoryExists = await Category.findOne({
      name: category,
      user: req.user.id,
    });

    if (!categoryExists) {
      return res.status(400).json({ message: 'Please select a valid category' });
    }

    const products = await Product.create({
      name,
      price,
      category,
      user: req.user.id,
    });

    res.status(201).json({
      message: 'Product created successfully',
      products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const result = await Product.deleteOne({ _id: req.params.id, user: req.user.id });

    if (!result.deletedCount) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const getProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const product = await Product.findOne({ user: req.user.id, _id: req.params.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { name, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const categoryExists = await Category.findOne({
      name: category,
      user: req.user.id,
    });

    if (!categoryExists) {
      return res.status(400).json({ message: 'Please select a valid category' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = { getAllProducts, createProduct, deleteProduct, getProduct, updateProduct };

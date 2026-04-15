const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getAllCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router.get('/list', protect, getAllCategories);
router.post('/create', protect, createCategory);
router.delete('/delete/:id', protect, deleteCategory);

module.exports = router;

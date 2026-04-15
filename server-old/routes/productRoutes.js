const express = require('express');
const router = express.Router();
const app = express();
const protect = require('../middleware/authMiddleware');

const { getProduct, createProduct, deleteProduct, getAllProducts, updateProduct} = require('../controllers/productController');
 
router.get('/list', protect, getAllProducts);
router.post('/create', protect, createProduct);
router.delete('/delete/:id', protect, deleteProduct);
router.get('/get/:id', protect, getProduct);
router.put('/update/:id', protect, updateProduct);
  
module.exports = router;
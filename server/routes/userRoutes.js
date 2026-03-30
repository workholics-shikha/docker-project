const express = require('express');
const router = express.Router();

const { registerUser, loginUser, usersList, userProfile } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.get('/profile', protect, userProfile);  
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/list', usersList);

module.exports = router;
 
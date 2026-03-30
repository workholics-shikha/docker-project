const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isLegacyPassword = user.password === password;
    const isMatch = isLegacyPassword
      ? true
      : await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (isLegacyPassword) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, surname, email, password, avatar, color } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name || '',
      surname: surname || '',
      email,
      password: hashedPassword,
      avatar,
      color,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const usersList = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ message: 'User list retrieved successfully', users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select({password:0,__v:0});

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Logged user data",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = { registerUser, loginUser, usersList, userProfile };

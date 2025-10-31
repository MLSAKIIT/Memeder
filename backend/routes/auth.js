const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { generateToken, setAuthCookie, clearAuthCookie } = require('../utils/jwt');
const {validateUserRegistration, validateUserLogin} = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', validateUserRegistration, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      name: req.body.name,
      username,
      email,
      password
    });

    await user.save();

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', validateUserLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists (explicitly select password field)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (clear cookie)

router.post('/logout', authMiddleware, (req, res) => {
  clearAuthCookie(res);
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   GET /api/auth/verify
// @desc    Verify if user is authenticated
router.get('/verify', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          swipeCount: user.swipes.length,
          joinedAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
});



module.exports = router;
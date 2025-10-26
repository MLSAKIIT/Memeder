const express = require('express');
const Meme = require('../models/Meme');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/memes
// @desc    Get random memes for swiping (excluding already swiped)
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    // get memes that user hasn't swiped on yet
    const swipedMemeIds = user.swipes.map(swipe => swipe.memeId);
    
    const memes = await Meme.find({
      _id: { $nin: swipedMemeIds },
      isActive: true
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('-stats'); // exclude stats from response
    
    res.json({
      success: true,
      data: memes
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/memes/swipe
// @desc    Handle meme swipe (like/dislike)
router.post('/swipe', authMiddleware, async (req, res, next) => {
  try {
    const { memeId, direction } = req.body;
    
    if (!memeId || !direction || !['left', 'right'].includes(direction)) {
      return res.status(400).json({
        success: false,
        message: 'invalid swipe data'
      });
    }
    
    // check if meme exists
    const meme = await Meme.findById(memeId);
    if (!meme) {
      return res.status(404).json({
        success: false,
        message: 'meme not found'
      });
    }
    
    // check if user already swiped on this meme
    const user = await User.findById(req.user._id);
    const alreadySwiped = user.swipes.some(swipe => 
      swipe.memeId.toString() === memeId
    );
    
    if (alreadySwiped) {
      return res.status(400).json({
        success: false,
        message: 'already swiped on this meme'
      });
    }
    
    // add swipe to user's swipes
    user.swipes.push({
      memeId: memeId,
      direction: direction,
      swipedAt: new Date()
    });
    await user.save();
    
    // update meme stats
    meme.stats.totalSwipes += 1;
    if (direction === 'right') {
      meme.likes += 1;
      meme.stats.rightSwipes += 1;
    } else {
      meme.dislikes += 1;
      meme.stats.leftSwipes += 1;
    }
    await meme.save();
    
    res.json({
      success: true,
      message: 'swipe recorded successfully'
    });
  } catch (error) {
    next(error);
  }
});


// @route   GET /api/memes/liked
// @desc    Get user's liked memes
router.get('/liked', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // get meme ids that user swiped right on
    const likedMemeIds = user.swipes
      .filter(swipe => swipe.direction === 'right')
      .map(swipe => swipe.memeId);
    
    const likedMemes = await Meme.find({
      _id: { $in: likedMemeIds },
      isActive: true
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: likedMemes
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/memes/disliked
// @desc    Get user's disliked memes
router.get('/disliked', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // get meme ids that user swiped left on
    const dislikedMemeIds = user.swipes
      .filter(swipe => swipe.direction === 'left')
      .map(swipe => swipe.memeId);
    
    const dislikedMemes = await Meme.find({
      _id: { $in: dislikedMemeIds },
      isActive: true
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: dislikedMemes
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

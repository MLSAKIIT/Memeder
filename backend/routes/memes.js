const express = require('express');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
// const upload = require('../middleware/upload');
const { validateMemeUpload, validateUpdatedMeme } = require('../middleware/validation');
const { createMeme, getMemesById, updateMeme, deleteMeme, getRandomMemes } = require('../controllers/memeController');

const router = express.Router();

// @route   GET /api/memes
// @desc    Get random memes for swiping (excluding already swiped)
router.get('/', authMiddleware, getRandomMemes);

// @route   POST /api/memes
// @desc    Create a new meme (supports both file upload and URL)
router.post('/', authMiddleware, upload.single('image'), validateMemeUpload, createMeme);

// @route   GET /api/memes/mine
// @desc    Get memes created by the current user
router.get('/mine', authMiddleware, getUserMemes);

// @route   GET /api/memes/liked
// @desc    Get memes liked by the current user
router.get('/liked', authMiddleware, getLikedMemes);

// @route   GET /api/memes/disliked
// @desc    Get memes disliked by the current user
router.get('/disliked', authMiddleware, getDislikedMemes);

// @route   GET /api/memes/:id
// @desc    Get meme by ID
router.get('/:id', authMiddleware, validateObjectId('id'), getMemesById);

// @route   PUT /api/memes/:id
// @desc    Update a meme (only by owner)
router.put('/:id', authMiddleware, validateObjectId('id'), upload.single('image'), validateUpdatedMeme, updateMeme);

// @route   DELETE /api/memes/:id
// @desc    Delete a meme (only by owner)
router.delete('/:id', authMiddleware, validateObjectId('id'), deleteMeme);

module.exports = router;

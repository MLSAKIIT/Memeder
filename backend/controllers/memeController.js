const Meme = require("../models/Meme");
const User = require("../models/User");
const Swipe = require('../models/Swipe');
const path = require('path');
const fs = require('fs');
const Swipe = require('../models/Swipe');
const { 
  uploadToCloudinary, 
  deleteFromCloudinary, 
  getImageFromCloudinary 
} = require('../utils/cloudinaryUpload')

const createMeme = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const { title, description, tags } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    console.log("Uploading to Cloudinary...");

    image = await uploadToCloudinary(req.file.buffer);

    // Save meme to DB
    try {
      const newMeme = new Meme({
        imageUrl: image.secure_url,
        imageId: image.public_id,
        title,
        description,
        tags,
        createdBy: req.user.id,
      });

      await newMeme.save();

      res.status(201).json({
        message: "Meme created successfully",
        meme: newMeme,
      });
    } catch (dbError) {
      // DB save failed → clean up Cloudinary image
      console.error("Error saving meme to DB:", dbError);
      await deleteFromCloudinary(image.public_id);
      next(dbError);
    }
  } catch (error) {
    // Clean up uploaded file if meme creation fails
    if (req.file) {
      const filePath = path.join(__dirname, '../assets/images', req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
      });
    }
    next(error);
  }
};

const getMemesById = async (req, res, next) => {
  try {
    const meme = await Meme.findById(req.params.id)
      .populate('createdBy', 'username name')
      .lean();

    if (!meme) {
      return res.status(404).json({
        success: false,
        message: 'Meme not found'
      });
    }
    const findMemeImageURL = await getImageFromCloudinary(meme.imageId);
    res.json({ ...meme.toObject(), imageUrl: findMemeImageURL.secure_url });
  } catch (error) {
    next(error);
  }
};

const updateMeme = async (req, res, next) => {
  try {
    const meme = await Meme.findById(req.params.id);
    
    if (!meme) {
      return res.status(404).json({
        success: false,
        message: 'Meme not found'
      });
    }

    // Check ownership
    if (meme.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own memes'
      });
    }

    // Update fields
    const { title, description, tags } = req.body;
    if (title) meme.title = validator.escape(title);
    if (description) meme.description = validator.escape(description);
    if (tags) meme.tags = tags;

    // Handle image update
    if (req.file) {
      //delete old image from cloudinary
      await deleteFromCloudinary(meme.imageId);
      //upload new image to cloudinary
      const newImage =  await uploadToCloudinary(req.file.buffer);
      meme.imageId = newImage.public_id;
    }

    await meme.save();
    await meme.populate('createdBy', 'username name');

    res.json({
      success: true,
      message: 'Meme updated successfully',
      data: {
        meme: {
          id: meme._id,
          title: meme.title,
          description: meme.description,
          imageUrl: meme.imageUrl,
          tags: meme.tags,
          createdBy: {
            id: meme.createdBy._id,
            username: meme.createdBy.username,
            name: meme.createdBy.name
          },
          updatedAt: meme.updatedAt,
          stats: meme.stats
        }
      }
    });
  } catch (error) {
    // Clean up uploaded file if update fails
    if (req.file) {
      const filePath = path.join(__dirname, '../assets/images', req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
      });
    }
    next(error);
  }
};

const deleteMeme = async (req, res, next) => {
  try {
    const meme = await Meme.findById(req.params.id);
    
    if (!meme) {
      return res.status(404).json({
        success: false,
        message: 'Meme not found'
      });
    }

    // Check ownership
    if (meme.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own memes'
      });
    }

    // Delete associated swipes
    await Swipe.deleteMany({ meme: meme._id });
    // Delete image from Cloudinary
    await deleteFromCloudinary(meme.imageId);
    // Delete meme
    await meme.deleteOne();

    res.json({
      success: true,
      message: 'Meme deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getRandomMemes = async (req, res, next) => {
  try {
    // Get memes the user has already swiped on
    const swipedMemes = await Swipe.find({ user: req.user.id }).distinct('meme');
    
    // Build query to exclude swiped memes
    const query = { 
      isActive: true,
      _id: { $nin: swipedMemes }
    };

    // Get random memes with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const memes = await Meme.aggregate([
      { $match: query },
      { $sample: { size: limit + skip } }, // Get more than needed for pagination
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator',
          pipeline: [
            { $project: { username: 1, name: 1 } }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          imageUrl: 1,
          tags: 1,
          createdAt: 1,
          stats: 1,
          createdBy: { $arrayElemAt: ['$creator', 0] }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        memes: memes.map(meme => ({
          id: meme._id,
          title: meme.title,
          description: meme.description,
          imageUrl: meme.imageUrl,
          tags: meme.tags,
          createdAt: meme.createdAt,
          stats: meme.stats,
          createdBy: {
            id: meme.createdBy._id,
            username: meme.createdBy.username,
            name: meme.createdBy.name
          }
        })),
        pagination: {
          page,
          limit,
          hasMore: memes.length === limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUserMemes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const memes = await Meme.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Meme.countDocuments({ createdBy: req.user.id });

    res.json({
      success: true,
      data: {
        memes: memes.map(meme => ({
          id: meme._id,
          title: meme.title,
          description: meme.description,
          imageUrl: meme.imageUrl,
          tags: meme.tags,
          createdAt: meme.createdAt,
          updatedAt: meme.updatedAt,
          stats: meme.stats
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getLikedMemes = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'likedMemes',
        populate: {
          path: 'createdBy',
          select: 'username name'
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        memes: user.likedMemes.map(meme => ({
          id: meme._id,
          title: meme.title,
          description: meme.description,
          imageUrl: meme.imageUrl,
          tags: meme.tags,
          createdAt: meme.createdAt,
          stats: meme.stats,
          createdBy: {
            id: meme.createdBy._id,
            username: meme.createdBy.username,
            name: meme.createdBy.name
          }
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

const getDislikedMemes = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'dislikedMemes',
        populate: {
          path: 'createdBy',
          select: 'username name'
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        memes: user.dislikedMemes.map(meme => ({
          id: meme._id,
          title: meme.title,
          description: meme.description,
          imageUrl: meme.imageUrl,
          tags: meme.tags,
          createdAt: meme.createdAt,
          stats: meme.stats,
          createdBy: {
            id: meme.createdBy._id,
            username: meme.createdBy.username,
            name: meme.createdBy.name
          }
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMeme,
  getMemesById,
  updateMeme,
  deleteMeme,
  getRandomMemes,
  getUserMemes,
  getLikedMemes,
  getDislikedMemes
};

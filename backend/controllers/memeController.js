const Meme = require("../models/Meme");
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
    next(error);
  }
};

const getMemesById = async (req, res, next) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
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
      return res.status(404).json({ message: 'Meme not found' });
    }
    // Only the creator can update the meme
    if (meme.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { title, description, tags } = req.body;
    if (title) meme.title = title;
    if (description) meme.description = description;
    if (tags) meme.tags = tags;
    if (req.file) {
      //delete old image from cloudinary
      await deleteFromCloudinary(meme.imageId);
      //upload new image to cloudinary
      const newImage =  await uploadToCloudinary(req.file.buffer);
      meme.imageId = newImage.public_id;
    }
    await meme.save();
    res.json(meme);
  } catch (error) {
    next(error);
  }
};

const deleteMeme = async (req, res, next) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
      return res.status(404).json({ success: false, message: 'Meme not found' });
    }
    // Only the creator can delete the meme
    if (meme.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    // Delete associated swipes
    await Swipe.deleteMany({ meme: meme._id });
    // Delete image from Cloudinary
    await deleteFromCloudinary(meme.imageId);
    // Delete meme
    await meme.deleteOne();
    res.json({ success: true, message: 'Meme deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getRandomMemes = async (req, res, next) => {
  try {
    // Find meme IDs the user has already swiped on
    const swipedMemes = await Swipe.find({ user: req.user.id }).distinct('meme');
    // Exclude swiped memes and fetch random memes
    const memes = await Meme.aggregate([
      { $match: { _id: { $nin: swipedMemes } } },
      { $sample: { size: 20 } }, // Fetch 20 random memes
      { $project: {
          _id: 1,
          imageUrl: 1,
          title: 1,
          description: 1,
          tags: 1,
          createdBy: 1
        }
      }
    ]);
    res.json(memes);
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
};

const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Meme title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  imageId:{
    type: String,
    required: [true, 'Image ID is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  stats: {
    totalSwipes: {
      type: Number,
      default: 0
    },
    leftSwipes: {
      type: Number,
      default: 0
    },
    rightSwipes: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for efficient random selection
memeSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Meme', memeSchema);

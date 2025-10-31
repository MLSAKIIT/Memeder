const { body, validationResult, param, query } = require('express-validator');
const fs = require('fs');
const path = require('path');
const validator = require('validator');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Delete uploaded file if validation fails
    if (req.file) {
      const filePath = path.join(__dirname, '../assets/images', req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete file:', filePath, err);
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Helper: coerce tags into array from JSON string or CSV
function coerceTagsToArray(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {
      // not JSON, fall through to CSV
    }
    return trimmed.split(',').map(t => t.trim()).filter(Boolean);
  }
  return [];
}

// User registration validation
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Password must be between 6 and 100 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// URL validation for imageUrl
const validateMemeUrl = [
  body('imageUrl')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Image URL must be a valid HTTP/HTTPS URL')
    .custom((value) => {
      if (value) {
        // Check if URL points to an image
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const urlPath = new URL(value).pathname.toLowerCase();
        const hasImageExtension = imageExtensions.some(ext => urlPath.endsWith(ext));
        
        if (!hasImageExtension) {
          throw new Error('Image URL must point to an image file (.jpg, .jpeg, .png, .gif, .webp)');
        }
      }
      return true;
    }),

  handleValidationErrors
];

// Meme creation validation (supports both file upload and URL)
const validateMemeUpload = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .escape(), // Sanitize HTML

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters')
    .escape(), // Sanitize HTML

  // Coerce tags before checking array
  body('tags')
    .optional()
    .customSanitizer((raw) => coerceTagsToArray(raw))
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 0) {
        if (tags.length > 10) {
          throw new Error('Maximum 10 tags allowed');
        }
        // Validate each tag
        for (const tag of tags) {
          if (typeof tag !== 'string' || tag.trim().length === 0) {
            throw new Error('Each tag must be a non-empty string');
          }
          if (tag.trim().length > 20) {
            throw new Error('Each tag must be 20 characters or less');
          }
        }
      }
      return true;
    })
    .customSanitizer((tags) => {
      // Sanitize tags
      return tags ? tags.map(tag => validator.escape(tag.trim().toLowerCase())) : [];
    }),

  // Custom validation to ensure either file or imageUrl is provided
  body().custom((value, { req }) => {
    if (!req.file && !value.imageUrl) {
      throw new Error('Either upload an image file or provide an image URL');
    }
    return true;
  }),

  handleValidationErrors
];

// Meme update validation
const validateUpdatedMeme = [
  body('title')
    .trim()
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .escape(), // Sanitize HTML

  body('description')
    .trim()
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters')
    .escape(), // Sanitize HTML

  body('tags')
    .optional()
    .customSanitizer((raw) => coerceTagsToArray(raw))
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 0) {
        if (tags.length > 10) {
          throw new Error('Maximum 10 tags allowed');
        }
        // Validate each tag
        for (const tag of tags) {
          if (typeof tag !== 'string' || tag.trim().length === 0) {
            throw new Error('Each tag must be a non-empty string');
          }
          if (tag.trim().length > 20) {
            throw new Error('Each tag must be 20 characters or less');
          }
        }
      }
      return true;
    })
    .customSanitizer((tags) => {
      // Sanitize tags
      return tags ? tags.map(tag => validator.escape(tag.trim().toLowerCase())) : [];
    }),

  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateMemeUpload,
  validateUpdatedMeme,
  validateMemeUrl,
  validateObjectId
};




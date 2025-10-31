const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: process.env.CLOUDINARY_FOLDER_NAME },
        (error, result) => {
          if (error) {
            reject(new Error("Cloudinary upload failed"));
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(file).pipe(uploadStream);
    });
}

async function getImageFromCloudinary(publicId) {
  try {
    if (!publicId) {
      throw new Error("Missing publicId");
    }

    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    throw new Error("Cloudinary fetch failed");
  }
}

async function deleteFromCloudinary(publicId) {
  try {

    if (!publicId) {
      throw new Error("Missing publicId");
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return { message: "Image deleted successfully", result };
  } catch (error) {
    throw new Error("Cloudinary deletion failed");
  }
};


module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
    getImageFromCloudinary
}
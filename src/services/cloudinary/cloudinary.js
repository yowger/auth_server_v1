const cloudinary = require("cloudinary").v2

const cloudName = process.env.CLOUDINARY_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
})

function getCloudinaryUploadOptions(user) {
    const options = {
        unique_filename: true,
        overwrite: true,
        folder: `auth/${user._id}/profile_image`,
    }

    if (user.profileImage && user.profileImage.publicId) {
        options.public_id = user.profileImage.publicId
    }

    return options
}

module.exports = { cloudinary, getCloudinaryUploadOptions }

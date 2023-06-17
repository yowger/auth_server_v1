const {
    cloudinary,
    getCloudinaryUploadOptions,
} = require("../../services/cloudinary/cloudinary")
const { deleteManyPosts } = require("../../model/post/post.model")
const {
    getAllUsers,
    findUser,
    updateUser,
    deleteUser,
} = require("../../model/user/user.model")
const {
    resizeAndCompressImage,
} = require("../../services/sharp/imageProcessing")
const { getImageDataUrl } = require("../../services/uriParser/imageDataUrl")

async function httpGetAllUsers(req, res) {
    try {
        const users = await getAllUsers()

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "error fetching users" })
    }
}

async function httpGetUser(req, res) {
    try {
        const { id } = req.user

        const user = await findUser({ _id: id })
        console.log("getting user")

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: "error fetching users" })
    }
}

async function httpUpdateUser(req, res) {
    try {
        const { id: userId } = req.user
        const { name, username } = req.body

        const update = { name, username }

        const userUpdated = await updateUser(userId, update)

        if (!userUpdated.success) {
            return res
                .status(userUpdated.statusCode)
                .json({ message: userUpdated.message })
        }

        res.status(200).json({
            message: "User updated successfully.",
        })
    } catch (error) {
        return res.status(500).json({ message: "Failed to update user", error })
    }
}

async function httpDeleteUser(req, res) {
    try {
        const { id: userId } = req.user

        const userFilter = { _id: userId }

        const userDeleted = await deleteUser(userFilter)

        if (!userDeleted) {
            return res.status(404).json({
                success: false,
                message: "User not found or already deleted.",
            })
        }

        const postFilter = { user: userId }

        await deleteManyPosts(postFilter)

        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        })
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete user", error })
    }
}

// function resizeAndCompressImage(imageBuffer, options = {}) {
//     const {
//         width = 300,
//         height = 300,
//         fit = "cover",
//         position = "center",
//         quality = 80,
//     } = options

//     return sharp(imageBuffer)
//         .resize({ width, height, fit, position })
//         .jpeg({ quality })
//         .toBuffer()
// }

// const getImageDataUrl = (buffer, format) => {
//     const parser = new DatauriParser()
//     parser.format(format, buffer)
//     const imageDataUrl = parser.content

//     return imageDataUrl
// }

async function httpUploadProfileImage(req, res) {
    try {
        if (req.fileTypeError) {
            const errorMessage = req.fileTypeError
            return res.status(415).json({ error: errorMessage })
        }

        if (req.fileSizeError) {
            const errorMessage = req.fileSizeError
            return res.status(413).json({ error: errorMessage })
        }

        if (!req.file || !req.file.buffer) {
            const errorMessage = "No image file provided"
            return res.status(400).json({ error: errorMessage })
        }

        const { id: userId } = req.user
        const user = await findUser({ _id: userId })

        const imageBuffer = req.file.buffer

        const PROFILE_IMAGE_OPTIONS = {
            width: 300,
            height: 300,
            fit: "cover",
            position: "center",
            quality: 80,
        }

        const compressedImageBuffer = await resizeAndCompressImage(
            imageBuffer,
            PROFILE_IMAGE_OPTIONS
        )

        const imageDataUrl = getImageDataUrl(compressedImageBuffer, ".png")

        const options = getCloudinaryUploadOptions(user)

        const result = await cloudinary.uploader.upload(imageDataUrl, options)

        // if users profile image has public id then only update public id,
        // else  update public id and url, at default both are empty
        user.profileImage = user.profileImage?.publicId
            ? { ...user.profileImage, url: result.secure_url }
            : { publicId: result.public_id, url: result.secure_url }

        await user.save()

        res.status(200).json({
            message: "Profile image updated successfully",
        })
    } catch (error) {
        console.log("error uploading file: ", error)
        res.status(500).json({ error: "failed to upload profile image" })
    }
}

module.exports = {
    httpGetAllUsers,
    httpGetUser,
    httpUpdateUser,
    httpDeleteUser,
    httpUploadProfileImage,
}

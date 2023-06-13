const {
    getAllUsers,
    findUser,
    updateUser,
    deleteUser,
} = require("../../model/user/user.model")

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
        console.log(
            "🚀 ~ file: user.controller.js:18 ~ httpGetUser ~ user:",
            user
        )

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

        const filter = { _id: userId }

        const userDeleted = await deleteUser(filter)

        if (!userDeleted) {
            return res.status(404).json({
                success: false,
                message: "User not found or already deleted.",
            })
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        })
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete user", error })
    }
}

module.exports = {
    httpGetAllUsers,
    httpGetUser,
    httpUpdateUser,
    httpDeleteUser,
}

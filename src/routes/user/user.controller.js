const { getAllUsers } = require("../../model/user/user.model")

async function httpGetAllUsers(req, res) {
    try {
        const users = await getAllUsers()

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "error fetching users" })
    }
}

module.exports = {
    httpGetAllUsers,
}

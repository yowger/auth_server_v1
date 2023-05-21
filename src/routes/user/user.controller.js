const { getAllUsers } = require("../../model/user/user.model")

async function httpGetAllUsers(req, res) {
    const users = await getAllUsers()

    res.status(200).json(users)
}

module.exports = {
    httpGetAllUsers,
}

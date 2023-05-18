const { createUser, getAllUsers } = require("../../model/user/user.model")

async function httpRegisterUser(req, res) {
    const { username, name, email } = req.body

    if (!username || !name || !email) {
        return res
            .status(400)
            .json({ message: "Missing required user property" })
    }

    const userDoc = await createUser({
        username,
        name,
        email,
    })

    if (userDoc) {
        return res.status(201).json({ message: "New user created" })
    } else {
        return res.status(400).json({ message: "Invalid user data received" })
    }
}

async function httpGetAllUsers(req, res) {
    const users = await getAllUsers()

    res.status(200).json(users)
}

module.exports = {
    httpRegisterUser,
    httpGetAllUsers,
}

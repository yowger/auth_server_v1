const { createUser } = require("../../model/user/user.model")

async function httpRegisterUser(req, res) {
    const { username, name, email, password } = req.body

    const userDoc = await createUser({
        username,
        name,
        email,
        password,
    })

    if (userDoc) {
        return res.status(201).json({ message: "New user created" })
    } else {
        return res.status(400).json({ message: "Invalid user data received" })
    }
}

module.exports = {
    httpRegisterUser,
}

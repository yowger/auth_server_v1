const userDatabase = require("./user.mongo")

async function createUser(user) {
    const { username, name, email } = user

    const userDoc = new userDatabase({
        username,
        name,
        email,
    })

    return await userDoc.save()
}

async function getAllUsers() {
    return await userDatabase.find(
        {},
        {
            __v: 0,
        }
    )
}

module.exports = {
    createUser,
    getAllUsers,
}

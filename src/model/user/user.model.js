const userDatabase = require("./user.mongo")
const bcrypt = require("bcrypt")

async function createUser(user) {
    console.log("create new user in user.model ", user)
    const { provider, username, name, email, password, googleId } = user

    const providerIsGoogle =
        (provider.toLowerCase() === "google" && googleId) || false

    let userObject = {
        provider,
        username,
        name,
        email,
        password,
    }

    if (providerIsGoogle) {
        userObject.googleId = googleId
    }

    const userDoc = new userDatabase(userObject)

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

async function findUser(filter) {
    return await userDatabase.findOne(filter, {
        __v: 0,
    })
}

// async matchPassword()

// todo delete user

// toto get one user

module.exports = {
    createUser,
    getAllUsers,
    findUser,
}

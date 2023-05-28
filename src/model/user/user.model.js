const userDatabase = require("./user.mongo")

async function createUser(user) {
    console.log("create new user in user.model ", user)
    const { provider, username, name, email, password } = user

    let userObject = {
        provider,
        username,
        name,
        email,
        password,
    }

    const userDoc = new userDatabase(userObject)

    return await userDoc.save()
}

async function createGoogleUser(googleUser) {
    const { provider, googleId, username, name, email, avatar, verified } =
        googleUser

    const googleUserObject = {
        provider,
        googleId,
        username,
        name,
        email,
        avatar,
        verified,
    }

    const userDoc = new userDatabase(googleUserObject)

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
    createGoogleUser,
    getAllUsers,
    findUser,
}

const userDatabase = require("./user.mongo")
const generateRandomUsername = require("../../utils/generateRandomUsername")

async function createUser(user) {
    const { provider, username, name, email, password } = user

    let assignUsername = username || generateRandomUsername()

    const userDoc = new userDatabase({
        provider,
        username: assignUsername,
        name,
        email,
        password,
    })

    const createdUser = await userDoc.save()

    return createdUser
}

async function createGoogleUser(googleUser) {
    const { provider, googleId, username, name, email, avatar, verified } =
        googleUser

    const userDoc = new userDatabase({
        provider,
        googleId,
        username,
        name,
        email,
        avatar,
        verified,
    })

    const createdGoogleUser = await userDoc.save()

    return createdGoogleUser
}

async function getAllUsers() {
    const users = await userDatabase.find(
        {},
        {
            __v: 0,
        }
    )

    return users
}

async function findUser(filter) {
    const foundUser = await userDatabase.findOne(filter, {
        __v: 0,
        updatedAt: 0,
    })

    return foundUser
}

async function updateUser(userId, update) {
    const { name, username } = update

    const usernameExist = await findUser({
        username,
        _id: { $ne: userId },
    })

    if (usernameExist) {
        return {
            success: false,
            statusCode: 409,
            message: "Username already taken",
        }
    }

    const filter = { _id: userId }

    const result = await userDatabase.updateOne(filter, {
        name,
        username,
    })

    const updateSuccessful = result.modifiedCount === 1

    if (updateSuccessful) {
        return {
            success: true,
        }
    } else {
        return { success: false, statusCode: 404, message: "User not found" }
    }
}

async function deleteUser(filter) {
    const result = await userDatabase.deleteOne(filter)
    const deleteSuccessful = result.deletedCount === 1

    if (deleteSuccessful) {
        return true
    } else {
        return false
    }
}

module.exports = {
    createUser,
    createGoogleUser,
    getAllUsers,
    findUser,
    updateUser,
    deleteUser,
}

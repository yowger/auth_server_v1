const userDatabase = require("./user.mongo")

async function createUser(user) {
    const { username, name, email, password } = user

    const userDoc = new userDatabase({
        username,
        name,
        email,
        password,
    })

    const createdUser = await userDoc.save()

    return createdUser
}

async function createGoogleUser(googleUser) {
    const { provider, username, name, email, profileImageUrl, verified } =
        googleUser

    const userDoc = new userDatabase({
        provider,
        username,
        name,
        email,
        profileImage: {
            url: profileImageUrl,
        },
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
    const { name, username, avatar } = update

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
        avatar,
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

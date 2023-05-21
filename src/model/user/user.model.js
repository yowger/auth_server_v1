const userDatabase = require("./user.mongo")
const bcrypt = require("bcrypt")

async function createUser(user) {
    const { username, name, email, password } = user

    const userDoc = new userDatabase({
        username,
        name,
        email,
        password,
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

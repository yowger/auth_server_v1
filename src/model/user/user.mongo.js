// done?
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userModel = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

userModel.pre("save", async function (next) {
    const user = this
    const rounds = 10

    user.password = await bcrypt.hash(user.password, rounds)

    next()
})

module.exports = mongoose.model("User", userModel)

// done?
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    try {
        const user = this
        const rounds = 10

        if (!user.isModified("password")) {
            next()
        }

        const hashedPassword = await bcrypt.hash(user.password, rounds)
        user.password = hashedPassword

        next()
    } catch (error) {
        return next(error)
    }
})

userSchema.methods.matchPassword = async function (password) {
    try {
        const user = this
        return await bcrypt.compare(password, user.password)
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = mongoose.model("User", userSchema)

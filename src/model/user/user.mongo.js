// done?
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            trim: true,
            min: 6,
            max: 20,
        },
        role: {
            type: String,
            default: "USER",
        },
        provider: {
            type: String,
            required: true,
        },
        googleId: {
            type: String,
            unique: true,
        },
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    try {
        const user = this
        console.log("🚀 ~ file: user.mongo.js:46 ~ user:", user)

        const providerIsNotAnEmail = user.provider !== "email"
        const passwordAlreadyModified = !user.isModified("password")

        if (providerIsNotAnEmail || passwordAlreadyModified) {
            next()
        }

        const rounds = 10
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

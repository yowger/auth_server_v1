const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            index: true,
            required: true,
            trim: true,
            min: 2,
            max: 50,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            min: 2,
            max: 30,
        },
        email: {
            type: String,
            unique: true,
            index: true,
            trim: true,
            lowercase: true,
            required: true,
        },
        password: {
            type: String,
            trim: true,
            min: 5,
            max: 20,
        },
        roles: {
            type: [String],
            default: ["USER"],
        },
        provider: {
            type: String,
            required: true,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        avatar: {
            type: String,
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    try {
        const user = this

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

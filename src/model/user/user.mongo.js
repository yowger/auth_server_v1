const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            trim: true,
            min: 2,
            max: 50,
            index: true,
        },
        name: {
            type: String,
            trim: true,
            min: 2,
            max: 30,
            default: null,
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
            name: {
                type: String,
                enum: ["google", "facebook", "twitter", "regular"],
                default: "regular",
            },
            id: {
                type: String,
                unique: true,
                sparse: true,
            },
        },
        profileImage: {
            publicId: {
                type: String,
                default: null,
            },
            url: {
                type: String,
                default: null,
            },
        },
        verified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpiry: {
            type: Date,
            default: null,
        },
        lastResetPasswordTimestamp: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
)

userSchema.index({ email: 1, "provider.name": 1 }, { unique: true })

userSchema.pre("save", async function (next) {
    try {
        const user = this
        console.log("🚀 ~ file: user.mongo.js:72 ~ user:", user)

        const proverNotRegular =
            user.provider && user.provider.name !== "regular"
        const passwordAlreadyModified = !user.isModified("password")

        if (proverNotRegular || passwordAlreadyModified) {
            next()
        }

        console.log("modifying password")

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
        console.log("🚀 this: ", this)
        console.log("🚀 password: ", password)
        console.log("🚀 database password", user.password)
        const comparedPassword = await bcrypt.compare(password, user.password)

        return comparedPassword
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = mongoose.model("User", userSchema)

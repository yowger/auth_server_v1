const express = require("express")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const authRouter = express.Router()
const { findUser } = require("../../model/user/user.model")
const validate = require("../../middleware/validation/validate")
const userValidation = require("../../middleware/validation/user.validation")

require("../../services/passport.config")

authRouter.post(
    "/signup",
    validate(userValidation),
    passport.authenticate("local-signup", { session: false }),
    function (req, res) {
        console.log("come here")
        console.log("user", req.user)

        // if (error) {
        //     return res.status(400).json({ error })
        // }
        const userExists = req.user
        console.log("🚀 ~ file: auth.router.js:21 ~ userExists:", userExists)

        if (!req.user) {
            return res.status(400).json({ message: "No user found" })
        }

        return res.status(200).json({ user: req.user })
    }
)

authRouter.post(
    "/login",
    passport.authenticate("local-login", { session: false }),
    function (req, res) {
        const userId = String(req.user._id)

        const accessToken = jwt.sign(
            { user: { id: userId } },
            process.env.JWT_SECRET,
            {
                expiresIn: "20s",
            }
        )

        const refreshToken = jwt.sign(
            { userId: userId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        )

        const oneDay = 1 * 24 * 60 * 60 * 1000

        res.cookie("jwt", refreshToken, {
            // httpOnly: true,
            // secure: true,
            // sameSite: "none",
            maxAge: oneDay,
            // maxAge: 10000,
        })

        res.status(200).json({
            success: true,
            accessToken,
            status: "You are successfully logged in.",
        })
    }
)

authRouter.get("/refresh_token", async function (req, res) {
    try {
        const cookies = req.cookies
        console.log("🚀 ~ file: auth.router.js:71 ~ cookies:", cookies)

        if (!cookies?.jwt) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const refreshToken = cookies.jwt

        const decodedJwt = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const userId = decodedJwt.userId

        const userExists = await findUser({ _id: userId })

        if (!userExists) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const accessToken = jwt.sign(
            { user: { id: userId } },
            process.env.JWT_SECRET,
            {
                expiresIn: "20s",
            }
        )

        res.json({ accessToken })
    } catch (error) {
        console.log("🚀 ~ file: auth.router.js:90 ~ error:", error)
        return res.status(401).json({ message: "Unauthorized" })
    }
})

authRouter.get("/logout", (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204)
    } 

    res.json({ message: "user logout" })
})

authRouter.get(
    "/test",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        console.log("this is a protected route")
        res.status(200).json({ message: "this is a protected route" })
    }
)

// todo persist session
// todo some functions move to controllers

// function serializeUser(user, done) {
//     console.log("serializing user: ")
//     console.log(user)
//     done(null, user)
// }

// function deserializeUser(user, done) {
//     console.log("deserializeUser user: ", user)
//     return done(null, {
//         user,
//     })
// }

// passport.serializeUser(serializeUser)
// passport.deserializeUser(deserializeUser)

module.exports = authRouter

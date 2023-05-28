const express = require("express")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const authRouter = express.Router()
const { findUser, createUser } = require("../../model/user/user.model")
const validate = require("../../middleware/validate")
const userValidation = require("../../services/joi/schemas/user.validation")

authRouter.post("/signup", validate(userValidation), async function (req, res) {
    try {
        const { username, name, email, password } = req.body

        const userExists = await findUser({ email })

        if (userExists) {
            return res.status(422).send({ message: "Email already in use" })
        }

        const newUser = await createUser({
            provider: "email",
            username,
            name,
            email,
            password,
        })

        console.log("new user ", newUser)

        res.json({ message: "Register success." })
    } catch (error) {
        return res.status(400).json({ error })
    }
})

authRouter.post(
    "/login",
    passport.authenticate("local-login", { session: false }),
    function (req, res) {
        const userId = String(req.user._id)

        const accessToken = jwt.sign(
            { user: { id: userId } },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m",
            }
        )

        const refreshToken = jwt.sign(
            { userId: userId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        )

        const oneDay = 1 * 24 * 60 * 60 * 1000

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: oneDay,
            // maxAge: 10000,
        })

        console.log("cookies")

        res.status(200).json({
            accessToken,
        })
    }
)

authRouter.get("/refresh_token", async function (req, res) {
    console.log("refresh token user ", req?.user)
    try {
        const cookies = req.cookies
        console.log("🚀 ~ file: auth.router.js:71 ~ cookies:", cookies)

        if (!cookies?.jwt) {
            return res.sendStatus(403)
            // .json({ message: "Unauthorized" })
        }

        console.log("still going")

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
                expiresIn: "15m",
            }
        )

        res.json({ accessToken })
    } catch (error) {
        console.log("🚀 ~ file: auth.router.js:90 ~ error:", error)
        return res.status(401).json({ message: "Unauthorized" })
    }
})

authRouter.get("/login/success", (req, res) => {
    // if cookies then give access token

    // give access token
    if (req.user) {
        res.json({
            message: "User Authenticated",
            user: req.user,
        })
    } else
        res.status(400).json({
            message: "User Not Authenticated",
            user: null,
        })
})

authRouter.get("/login/failed", (req, res) => {
    res.status(401).json({
        message: "user failed to authenticate.",
    })
})

authRouter.post("/logout", (req, res) => {
    console.log("logout")
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204)
    }

    console.log("clear cookie")
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" })
    console.log("clear cookie 2")

    res.json({ message: "user successfully logout" })
})

authRouter.get(
    "/test",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        console.log("this is a protected route")
        res.status(200).json({ message: "this is a protected route" })
    }
)

module.exports = authRouter

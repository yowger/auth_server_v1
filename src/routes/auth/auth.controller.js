const jwt = require("jsonwebtoken")
const { findUser, createUser } = require("../../model/user/user.model")
const {
    issueRefreshToken,
    issueAccessToken,
    verifyRefreshToken,
} = require("../../services/jwt")
const { cookieConfig } = require("../../utils/cookieConfig")

async function httpRegisterUser(req, res) {
    try {
        console.log("register 1")
        const { username, name, email, password } = req.body
        console.log(
            "🚀 ~ file: auth.controller.js:14 ~ httpRegisterUser ~ username, name, email, password:",
            username,
            name,
            email,
            password
        )

        console.log("register 2")
        const userExists = await findUser({ email })

        console.log("register 3")
        if (userExists) {
            return res.status(409).send({ message: "Email already in use" })
        }
        console.log("register 4")

        const createdUser = await createUser({
            provider: "email",
            username,
            name,
            email,
            password,
        })
        console.log("register 5")

        if (!createdUser) {
            return res.status(404).json({ message: "Failed to create user." })
        }
        console.log("register 6")

        res.json({ success: true, message: "Register success." })
    } catch (error) {
        console.log(
            "🚀 ~ file: auth.controller.js:47 ~ httpRegisterUser ~ error:",
            error
        )
        return res
            .status(400)
            .json({ message: "failed to register user", error })
    }
}

function httpLoginUser(req, res) {
    try {
        const user = req.user
        const userId = String(req.user._id)

        const accessToken = issueAccessToken(user)

        const refreshToken = issueRefreshToken(userId)

        res.cookie("jwt", refreshToken, cookieConfig)

        res.status(200).json({
            accessToken,
        })
    } catch (error) {
        return res.status(401).json({ message: "failed to login" })
    }
}

async function httpRefreshToken(req, res) {
    try {
        const { isGuest } = req

        if (isGuest) {
            return res.json({ accessToken: null })
        }

        const cookies = req.cookies
        const noJwtCookie = !cookies?.jwt

        if (noJwtCookie) {
            // return res.status(401).json({ error: "Authentication is required" })
            return res.sendStatus(401)
        }

        const refreshTokenCookie = cookies.jwt

        try {
            const decodedJwt = verifyRefreshToken(refreshTokenCookie)

            const userId = decodedJwt.userId

            const userExists = await findUser({ _id: userId })

            if (!userExists) {
                // return res.status(404).json({ error: "User not found" })
                return res.sendStatus(401)
            }

            const accessToken = issueAccessToken(userExists)

            res.json({ accessToken })
        } catch (error) {
            // return res.status(401).json({ error: "Invalid refresh token" })
            return res.sendStatus(401)
        }
    } catch (error) {
        // return res.status(500).json({ error: "Internal server error" })
        return res.sendStatus(500)
    }
}

function httpLogout(req, res) {
    try {
        const cookies = req.cookies
        const noJwtCookie = !cookies?.jwt

        if (noJwtCookie) {
            return res.sendStatus(204)
        }

        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        })

        res.status(200).json({ message: "user successfully logout" })
    } catch (error) {
        return res.sendStatus(204)
    }
}

module.exports = {
    httpRegisterUser,
    httpLoginUser,
    httpRefreshToken,
    httpLogout,
}

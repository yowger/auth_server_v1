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
        return res
            .status(400)
            .json({ message: "failed to register user", error })
    }
}

function httpLoginUser(req, res) {
    try {
        console.log("im in logging in")
        
        const userId = String(req.user._id)

        const accessToken = issueAccessToken(userId)

        const refreshToken = issueRefreshToken(userId)

        res.cookie("jwt", refreshToken, cookieConfig)

        console.log("cookies")

        res.status(200).json({
            accessToken,
        })
    } catch (error) {
        return res.status(401).json({ message: "failed to login" })
    }
}

async function httpRefreshToken(req, res) {
    console.log("refresh token user ", req?.user)
    try {
        const cookies = req.cookies
        const noJwtCookie = !cookies?.jwt

        if (noJwtCookie) {
            return res.sendStatus(403)
        }

        const refreshTokenCookie = cookies.jwt

        const decodedJwt = verifyRefreshToken(refreshTokenCookie)

        const userId = decodedJwt.userId

        const userExists = await findUser({ _id: userId })

        if (!userExists) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const accessToken = issueAccessToken(userId)

        res.json({ accessToken })
    } catch (error) {
        console.log("🚀 ~ file: auth.router.js:90 ~ error:", error)
        return res.status(401).json({ message: "Unauthorized" })
    }
}

function httpLogout(req, res) {
    try {
        console.log("logout")

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

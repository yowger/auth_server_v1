const { findUser, createUser } = require("../../model/user/user.model")
const {
    issueRefreshToken,
    issueAccessToken,
    verifyRefreshToken,
    issueResetPasswordToken,
} = require("../../services/jwt")
const sendMail = require("../../services/sendMail")
const { cookieConfig } = require("../../utils/cookieConfig")
const generateRandomUsername = require("../../utils/generateRandomUsername")

async function httpRegisterUser(req, res) {
    try {
        const { username, name, email, password } = req.body

        let assignUsername = username || generateRandomUsername()

        const filter = { email, "provider.name": "regular" }

        const userExists = await findUser(filter)
        console.log(
            "🚀 ~ file: auth.controller.js:21 ~ httpRegisterUser ~ userExists:",
            userExists
        )

        if (userExists) {
            return res.status(409).send({ message: "Email already in use" })
        }

        const createdUser = await createUser({
            username: assignUsername,
            name,
            email,
            password,
        })

        if (!createdUser) {
            return res.status(404).json({ message: "Failed to create user." })
        }

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

async function httpForgotPassword(req, res) {
    try {
        const { email } = req.body
        const filter = { email, "provider.name": "regular" }

        const user = await findUser(filter)

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const currentTimestamp = Date.now()
        const coolDownPeriod = 5 * 60 * 1000

        const lastResetPasswordTimestamp = user.lastResetPasswordTimestamp

        if (
            lastResetPasswordTimestamp &&
            currentTimestamp - lastResetPasswordTimestamp < coolDownPeriod
        ) {
            console.log(
                "Please wait 5 minutes before requesting another reset password email."
            )
            return res.status(429).json({
                message:
                    "Too many reset password requests. Please wait before trying again.",
            })
        }

        console.log("im in")

        const resetPasswordToken = issueResetPasswordToken({
            userId: user._id,
            email,
        })

        const tenMinutes = 600000
        user.resetPasswordToken = resetPasswordToken
        user.resetPasswordExpiry = Date.now() + tenMinutes
        user.lastResetPasswordTimestamp = new Date()

        const subject = "Password Reset Request"
        const resetPasswordLink = `${process.env.CLIENT_URL}/reset_password/${resetPasswordToken}`
        const message = `Please click on the following link to reset your password: <a href="${resetPasswordLink}">Reset Password</a> If you did not request this, please ignore this email.`

        const emailSent = await sendMail(email, subject, message)

        if (emailSent) {
            await user.save()

            return res.status(200).json({
                success: true,
                message: "Password reset email sent successfully.",
            })
        } else {
            return res
                .status(500)
                .json({ message: "Failed to send password reset email." })
        }
    } catch (error) {
        console.log("Error in httpForgotPassword:", error)
        return res.status(500).json({ message: "Failed to reset password." })
    }
}

async function httpVerifyResetPassword(req, res) {
    try {
        const resetToken = req.headers.authorization.split(" ")[1]
        const { newPassword } = req.body

        if (!resetToken) {
            return res.status(400).json({ error: "Reset token is missing" })
        }

        if (!newPassword) {
            return res.status(400).json({ error: "New password is missing" })
        }

        const filter = { resetPasswordToken: resetToken }

        const user = await findUser(filter)

        if (!user) {
            return res
                .status(404)
                .json({ error: "Invalid or expired reset token." })
        }

        if (user.resetPasswordExpiry < Date.now()) {
            return res.status(400).json({ error: "Reset token has expired." })
        }

        user.password = newPassword
        user.resetPasswordToken = null
        user.resetPasswordExpiry = null
        user.lastResetPasswordTimestamp = undefined

        await user.save()

        return res
            .status(200)
            .json({ success: true, message: "Password reset successful." })
    } catch (error) {
        return res.sendStatus(204)
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
    httpForgotPassword,
    httpVerifyResetPassword,
    httpLogout,
}

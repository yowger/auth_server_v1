const express = require("express")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const googleRouter = express.Router()

googleRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)

googleRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login/failed",
        session: false,
    }),
    function (req, res) {
        const userId = String(req.user._id)
        console.log("user ", req?.user)
        console.log("new user ", req?.newUser)

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
        })

        res.redirect(process.env.CLIENT_HOME_PAGE_URL)
    }
)

module.exports = googleRouter

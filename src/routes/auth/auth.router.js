require("../../services/passport.config")

const express = require("express")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const authRouter = express.Router()
const validate = require("../../middleware/validation/validate")
const userValidation = require("../../middleware/validation/user.validation")

authRouter.post(
    "/signup",
    validate(userValidation),
    passport.authenticate("local-signup", { session: false }),
    function (req, res) {
        console.log("signing in")
        res.status(200).json({
            user: req.user,
        })
    }
)

authRouter.post(
    "/login",
    passport.authenticate("local-login", { session: false }),
    function (req, res) {
        jwt.sign(
            { user: req.user },
            "secretKey",
            { expiresIn: "1h" },
            function (error, token) {
                if (error) {
                    return res.status(400).json({
                        message: "Failed to login",
                        token: null,
                    })
                }

                res.status(200).json({
                    token,
                })
            }
        )
    }
)

// authRouter.get("/logout", (req, res) => {
//     console.log("before session ", req.session)
//     req.logout(logout)
//     console.log("after session ", req.session)

//     res.json({ message: "user logout" })
// })

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

module.exports = authRouter

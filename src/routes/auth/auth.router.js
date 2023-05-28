const express = require("express")
const passport = require("passport")
const authRouter = express.Router()
const validate = require("../../middleware/validate")
const userValidation = require("../../services/joi/schemas/user.validation")
const {
    httpRegisterUser,
    httpLoginUser,
    httpRefreshToken,
    httpLogout,
} = require("./auth.controller")

authRouter.post("/signup", validate(userValidation), httpRegisterUser)

authRouter.post(
    "/login",
    function (req, res, next) {
        passport.authenticate(
            "local-login",
            { session: false },
            function (error, user, info) {
                const errorMessage = info?.errors || null

                const userNotExist = !user

                if (userNotExist) {
                    return res.status(401).json({ message: errorMessage })
                }

                req.user = user

                next()
            }
        )(req, res, next)
    },
    httpLoginUser
)

authRouter.get("/refresh_token", httpRefreshToken)

authRouter.post("/logout", httpLogout)

// test
// authRouter.get("/login/success", (req, res) => {
//     // if cookies then give access token

//     // give access token
//     if (req.user) {
//         res.json({
//             message: "User Authenticated",
//             user: req.user,
//         })
//     } else
//         res.status(400).json({
//             message: "User Not Authenticated",
//             user: null,
//         })
// })

// // test
// authRouter.get("/login/failed", (req, res) => {
//     res.status(401).json({
//         message: "user failed to authenticate.",
//     })
// })

// test
// authRouter.get(
//     "/test",
//     passport.authenticate("jwt", { session: false }),
//     function (req, res) {
//         console.log("this is a protected route")
//         res.status(200).json({ message: "this is a protected route" })
//     }
// )

module.exports = authRouter

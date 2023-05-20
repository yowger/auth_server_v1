const express = require("express")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const bcrypt = require("bcrypt")
const authRouter = express.Router()
const { findUser } = require("../../model/user/user.model")

async function authenticateUser(username, password, done) {
    try {
        const user = await findUser({ email: username })

        if (!user) {
            return done(null, false, {
                message: "user not found",
            })
        }

        const matchPassword = await bcrypt.compare(password, user.password)

        if (!matchPassword) {
            return done(null, false, {
                message: "Password does not match",
            })
        }

        return done(null, user)
    } catch (error) {
        return done(error, false)
    }
}

function serializeUser(user, done) {
    console.log("serializing user: ")
    console.log(user)

    return done(null, {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
    })
}

function deserializeUser(user, done) {
    console.log("deserializeUser user: ", user)
    return done(null, {
        user,
    })
}

function logout(error) {
    if (error) {
        console.log("🚀 ~ file: auth.router.js:46 ~ logout ~ error:", error)
        return next(err)
    }
}

passport.use(new LocalStrategy(authenticateUser))
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

authRouter.post(
    "/login/password",
    (req, res, next) => {
        console.log("logging in")
        next()
    },
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    })
)

authRouter.get("/logout", (req, res) => {
    console.log("before session ", req.session)
    req.logout(logout)
    console.log("after session ", req.session)

    res.json({ message: "user logout" })
})

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        return res.status(401).json({ message: "unauthorized" })
    }
}

authRouter.get("/test", isAuthenticated, function (req, res) {
    console.log("this is a protected route")
    res.status(200).json({ message: "this is a protected route" })
})

// todo persist session
// todo some functions move to controllers

module.exports = authRouter

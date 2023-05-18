const helmet = require("helmet")
const expressSession = require("express-session")
const path = require("path")
const express = require("express")
const cors = require("cors")
const passport = require("passport")

const authRouter = require("./routes/auth/auth.router")
const userRouter = require("./routes/user/user.router")

const config = {
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}

const app = express()
app.use(express.json())

app.use(helmet())

app.use(
    cors({
        origin: "http://localhost:6001",
    })
)

app.use(
    expressSession({
        secret: config.COOKIE_KEY_1,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000, secure: true },
    })
)

app.use(passport.authenticate("session"))

app.use("/user", userRouter)
app.use("/", authRouter)

module.exports = app

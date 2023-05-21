const helmet = require("helmet")
const express = require("express")
const cors = require("cors")

const authRouter = require("./routes/auth/auth.router")
const userRouter = require("./routes/user/user.router")

const app = express()
app.use(express.json())

app.use(helmet())

app.use(
    cors({
        origin: "http://localhost:6001",
    })
)

app.use("/user", userRouter)
app.use("/auth", authRouter)

module.exports = app

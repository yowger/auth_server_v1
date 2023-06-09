const helmet = require("helmet")
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require("./services/cors")

const userRouter = require("./routes/user/user.router")
const authRouter = require("./routes/auth/auth.router")
const googleRouter = require("./routes/google/google.router")
const postRouter = require("./routes/post/post.router")

const app = express()

app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())
app.use(helmet())

require("./services/passport/jwtStrategy")
require("./services/passport/localStrategy")
require("./services/passport/googleStrategy")

app.use("/auth", authRouter)
app.use("/auth", googleRouter)
app.use("/user", userRouter)
app.use("/post", postRouter)

module.exports = app

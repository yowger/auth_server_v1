const express = require("express")
const passport = require("passport")
const { httpGetAllUsers } = require("./user.controller")

const userRouter = express.Router()

userRouter.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    httpGetAllUsers
)
// TODO get one user
// userRouter.get("/", httpGetUser)
// TODO delete one user
// userRouter.get("/", httpDeleteUser)
module.exports = userRouter

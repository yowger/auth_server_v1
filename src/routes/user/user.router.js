const express = require("express")
const { httpGetAllUsers, httpRegisterUser } = require("./user.controller")
const validate = require("../../middleware/validation/validate")
const userValidation = require("../../middleware/validation/user.validation")

const userRouter = express.Router()

userRouter.get("/", httpGetAllUsers)
// TODO get one user
// userRouter.get("/", httpGetUser)
// TODO delete one user
// userRouter.get("/", httpDeleteUser)

userRouter.post("/", validate(userValidation), httpRegisterUser)

module.exports = userRouter

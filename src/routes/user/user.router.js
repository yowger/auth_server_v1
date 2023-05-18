const express = require("express")
const { httpGetAllUsers, httpRegisterUser } = require("./user.controller")
const validate = require("../../middleware/validation/validate")
const userValidation = require("../../middleware/validation/user.validation")

const userRouter = express.Router()

userRouter.get("/", httpGetAllUsers)

userRouter.post("/", validate(userValidation), httpRegisterUser)

module.exports = userRouter

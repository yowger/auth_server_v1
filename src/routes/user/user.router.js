const express = require("express")
const passport = require("passport")
const USER_ROLES = require("../../constants/userRoles")
const checkUserRole = require("../../middleware/checkUserRole")
const userRouter = express.Router()
const { upload } = require("../../services/multer/multer")
const {
    httpGetAllUsers,
    httpGetUser,
    httpUpdateUser,
    httpDeleteUser,
    httpUploadProfileImage,
} = require("./user.controller")

userRouter.get(
    "/",
    // passport.authenticate("jwt", { session: false }),
    httpGetAllUsers
)
// TODO get one user
userRouter.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    checkUserRole([USER_ROLES.USER]),
    httpGetUser
)

userRouter.put(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    checkUserRole([USER_ROLES.USER]),
    httpUpdateUser
)

userRouter.delete(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    checkUserRole([USER_ROLES.USER]),
    httpDeleteUser
)

userRouter.post(
    "/upload_profile_image",
    passport.authenticate("jwt", { session: false }),
    checkUserRole([USER_ROLES.USER]),
    upload.single("file"),
    httpUploadProfileImage
)
// TODO delete one user
// userRouter.get("/", httpDeleteUser)
module.exports = userRouter

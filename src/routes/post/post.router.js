const express = require("express")
const passport = require("passport")
const USER_ROLES = require("../../constants/userRoles")
const checkUserRole = require("../../middleware/checkUserRole")
const postRouter = express.Router()
const {
    httpCreateNewPost,
    httpGetAllPost,
    httpGetUserPost,
    httUpdatePost,
    httpDeletePost,
} = require("./post.controller")

postRouter.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    checkUserRole([USER_ROLES.USER, USER_ROLES.ADMIN]),
    httpCreateNewPost
)

postRouter.get("/", httpGetAllPost)

postRouter.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    checkUserRole([USER_ROLES.USER, USER_ROLES.ADMIN]),
    httUpdatePost
)

postRouter.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    checkUserRole([USER_ROLES.USER, USER_ROLES.ADMIN]),
    httpDeletePost
)

module.exports = postRouter

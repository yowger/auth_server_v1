const express = require("express")
const passport = require("passport")
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
    httpCreateNewPost
)

postRouter.get("/", httpGetAllPost)

postRouter.put("/", httUpdatePost)

postRouter.delete("/", httpDeletePost)

module.exports = postRouter

const {
    createPost,
    getAllPost,
    updatePost,
    deletePost,
} = require("../../model/post/post.model")

async function httpCreateNewPost(req, res) {
    try {
        console.log("meow 1")
        const { id } = req.user
        const { content } = req.body
        console.log("meow 2")
        
        const post = {
            userId: id,
            content,
        }
        console.log("meow 3")
        
        const createdPost = await createPost(post)
        console.log("meow 4")
        
        if (!createdPost) {
            return res
            .status(404)
            .json({ message: "Failed to create post. Post not found." })
        }
        console.log("meow 5")

        res.status(200).json({ message: "Post created successfully." })
    } catch (error) {
        return res.status(500).json({ message: "Failed to create post", error })
    }
}

async function httpGetAllPost(req, res) {
    try {
        const post = await getAllPost()

        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: "error fetching post" })
    }
}

async function httpGetUserPost(req, res) {
    return res.json({ message: "one post" })
}

async function httUpdatePost(req, res) {
    try {
        const { postId } = req.params
        const { content } = req.body

        const filter = { _id: postId }

        const update = { content }

        await updatePost(filter, update)

        res.status(200).json({ message: "Post updated successfully." })
    } catch (error) {
        return res.status(500).json({ message: "Failed to update post", error })
    }
}

async function httpDeletePost(req, res) {
    try {
        const { postId } = req.params

        const filter = { _id: postId }

        await deletePost(filter)

        res.status(200).json({ message: "Post deleted successfully." })
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete post", error })
    }
}

module.exports = {
    httpCreateNewPost,
    httpGetAllPost,
    httpGetUserPost,
    httUpdatePost,
    httpDeletePost,
}

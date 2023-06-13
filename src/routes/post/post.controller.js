const {
    createPost,
    getAllPost,
    updatePost,
    deletePost,
} = require("../../model/post/post.model")

async function httpCreateNewPost(req, res) {
    try {
        const { id } = req.user
        const { content } = req.body

        const post = {
            userId: id,
            content,
        }

        const createdPost = await createPost(post)

        if (!createdPost) {
            return res
                .status(404)
                .json({ message: "Failed to create post. Post not found." })
        }

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
        const { id } = req.user
        const { postId, content } = req.body

        const filter = { _id: postId, user: id }

        const update = { content }

        const postUpdated = await updatePost(filter, update)

        if (!postUpdated) {
            return res.status(404).json({ message: "Post not found." })
        }

        res.status(200).json({ message: "Post updated successfully." })
    } catch (error) {
        return res.status(500).json({ message: "Failed to update post", error })
    }
}

async function httpDeletePost(req, res) {
    try {
        const { postId } = req.body

        const filter = { _id: postId }

        const postDeleted = await deletePost(filter)

        if (!postDeleted) {
            return res.status(404).json({ message: "Post not found." })
        }

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

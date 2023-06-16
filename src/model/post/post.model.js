const postDatabase = require("./post.mongo")

async function createPost(post) {
    const { userId, content } = post

    const postDoc = new postDatabase({
        user: userId,
        content,
    })

    const createdPost = await postDoc.save()

    return createdPost
}

async function getAllPost() {
    const posts = await postDatabase
        .find(
            {},
            {
                updatedAt: 0,
                __v: 0,
            }
        )
        .populate("user", "_id username profileImage.url")
        .sort("-createdAt")
    return posts
}

async function updatePost(filter, update) {
    const { content } = update

    const result = await postDatabase.updateOne(filter, { content })

    const updateSuccessful = result.modifiedCount === 1

    if (updateSuccessful) {
        return true
    } else {
        return false
    }
}

async function deletePost(filter) {
    const result = await postDatabase.deleteOne(filter)
    const deleteSuccessful = result.deletedCount === 1

    if (deleteSuccessful) {
        return true
    } else {
        return false
    }
}

async function deleteManyPosts(filter) {
    const result = await postDatabase.deleteMany(filter)
    const deleteCount = result.deletedCount

    return deleteCount
}

module.exports = {
    createPost,
    getAllPost,
    updatePost,
    deletePost,
    deleteManyPosts,
}

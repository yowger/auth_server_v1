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
    const posts = await postDatabase.find(
        {},
        {
            _id: 0,
            updatedAt: 0,
            __v: 0,
        }
    )

    return posts
}

async function updatePost(filter, update) {
    const result = await postDatabase.updateOne(filter, update)
    const updateSuccessful = result.nModified === 1

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

module.exports = {
    createPost,
    getAllPost,
    updatePost,
    deletePost,
}

const jwt = require("jsonwebtoken")

function issueAccessToken(user) {
    console.log("🚀 ~ file: jwt.js:4 ~ issueAccessToken ~ user:", user)

    const { _id, username, name, roles, avatar = null } = user

    const accessTokenObject = {
        user: {
            id: _id,
            username,
            name,
            roles,
            avatar,
        },
    }

    return jwt.sign(accessTokenObject, process.env.JWT_SECRET, {
        expiresIn: "15m",
    })
}

function issueRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
    })
}

function verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
}

module.exports = { issueAccessToken, issueRefreshToken, verifyRefreshToken }

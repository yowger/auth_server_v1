const jwt = require("jsonwebtoken")

function issueAccessToken(userId) {
    return jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, {
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

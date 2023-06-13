const { issueRefreshToken } = require("../../services/jwt")
const { cookieConfig } = require("../../utils/cookieConfig")

async function httpGoogleCallback(req, res) {
    const userId = String(req.user._id)
    const HOMEPAGE = process.env.CLIENT_URL
    const endPoint = "/"
    const redirectPath = `${HOMEPAGE}${endPoint}`

    const refreshToken = issueRefreshToken(userId)

    res.cookie("jwt", refreshToken, cookieConfig)

    res.redirect(redirectPath)
}

module.exports = {
    httpGoogleCallback,
}

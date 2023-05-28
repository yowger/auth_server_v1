const { issueRefreshToken } = require("../../services/jwt")
const { cookieConfig } = require("../../utils/cookieConfig")

async function httpGoogleCallback(req, res) {
    const userId = String(req.user._id)

    const refreshToken = issueRefreshToken(userId)

    res.cookie("jwt", refreshToken, cookieConfig)

    res.redirect(process.env.CLIENT_HOME_PAGE_URL)
}

module.exports = {
    httpGoogleCallback,
}

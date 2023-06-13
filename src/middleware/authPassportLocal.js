const passport = require("passport")

function authPassportLocal(req, res, next) {
    passport.authenticate(
        "local-login",
        { session: false },
        function (error, user, info) {
            const errorMessage = info?.errors || null
            const statusCode = info?.statusCode || 400
            console.log("🚀 user: ", user)
            console.log("🚀 info: ", info)
            console.log("🚀 error: ", error)

            if (!user) {
                return res.status(statusCode).json({ message: errorMessage })
            }

            req.user = user

            next()
        }
    )(req, res, next)
}

module.exports = { authPassportLocal }

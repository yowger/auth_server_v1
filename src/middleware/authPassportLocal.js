const passport = require("passport")

function authPassportLocal(req, res, next) {
    passport.authenticate(
        "local-login",
        { session: false },
        function (error, user, info) {
            const errorMessage = info?.errors || null

            const userNotExist = !user

            if (userNotExist) {
                return res.status(401).json({ message: errorMessage })
            }

            req.user = user

            next()
        }
    )(req, res, next)
}

module.exports = { authPassportLocal }

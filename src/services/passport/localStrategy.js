const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { findUser } = require("../../model/user/user.model")

const localStrategy = new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
        try {
            const user = await findUser({ email, "provider.name": "regular" })

            if (!user) {
                return done(null, false, {
                    statusCode: 404,
                    errors: "email is not registered",
                })
            }

            const matchPassword = await user.matchPassword(password)

            if (!matchPassword) {
                return done(null, false, {
                    statusCode: 401,
                    errors: "invalid password",
                })
            }

            return done(null, user)
        } catch (error) {
            return done(error, false, { errors: "error logging in" })
        }
    }
)

passport.use("local-login", localStrategy)

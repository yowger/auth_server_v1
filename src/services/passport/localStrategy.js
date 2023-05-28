const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { findUser } = require("../../model/user/user.model")

const localStrategy = new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
        try {
            console.log("logging in")
            const user = await findUser({ email })

            if (!user) {
                return done(null, false, {
                    errors: "email is not registered",
                })
            }

            const matchPassword = await user.matchPassword(password)

            if (!matchPassword) {
                return done(null, false, {
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

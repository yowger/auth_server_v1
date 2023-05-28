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
                return done(null, false)
            }

            const matchPassword = await user.matchPassword(password)

            if (!matchPassword) {
                return done(null, false)
            }

            return done(null, user)
        } catch (error) {
            return done(error, false)
        }
    }
)

passport.use("local-login", localStrategy)

const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const { findUser, createUser } = require("../../model/user/user.model")

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:7001/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
        console.log("🚀 ~ file: passport.config.js:72 ~ profile:", profile)
        try {
            const { sub, name, given_name, email } = profile._json
            const googleId = sub
            const provider = profile.provider
            const username = `${given_name}${profile.id}`

            const userExists = await findUser({ email })

            if (userExists) {
                return done(null, userExists)
            }

            console.log("🚀 ~ file: passport.config.js:114 ~ user:", userExists)

            const newUser = await createUser({
                provider,
                googleId,
                username,
                name,
                email,
            })

            return done(null, newUser)
        } catch (error) {
            console.log(error)
        }
    }
)

passport.use(googleStrategy)

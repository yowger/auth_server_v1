const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const { findUser, createGoogleUser } = require("../../model/user/user.model")
const generateRandomUsername = require("../../utils/generateRandomUsername")

async function registerGoogleUser(accessToken, refreshToken, profile, done) {
    try {
        console.log("google profile: ", profile)
        const { sub, name, picture, email, email_verified } = profile._json
        const username = generateRandomUsername()

        const provider = {
            name: "google",
            id: sub,
        }

        const filter = { email, "provider.name": "google" }

        const userExists = await findUser(filter)

        if (userExists) {
            console.log("google user exist: ", userExists)
            return done(null, userExists)
        }

        const newUser = await createGoogleUser({
            provider,
            username,
            name,
            email,
            profileImageUrl: picture,
            verified: email_verified,
        })

        return done(null, newUser)
    } catch (error) {
        console.log(error)
    }
}

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    registerGoogleUser
)

passport.use(googleStrategy)

const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const { findUser } = require("../../model/user/user.model")

const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("authorization"),
        secretOrKey: process.env.JWT_SECRET,
    },
    async function (jwtPayload, done) {
        console.log(
            "🚀 ~ file: passport.config.js:71 ~ jwtPayload:",
            jwtPayload
        )

        try {
            const user = jwtPayload.user

            const userExists = await findUser({ _id: user.id })

            if (!userExists) {
                done(null, false)
            }

            console.log("🚀 ~ file: auth.router.js:109 ~ user:", user)
            done(null, user)
        } catch (error) {
            done(error, false)
        }
    }
)

passport.use(jwtStrategy)

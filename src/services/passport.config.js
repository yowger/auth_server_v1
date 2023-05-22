const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const { findUser, createUser } = require("../model/user/user.model")

passport.use(
    "local-signup",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async function (email, password, done) {
            try {
                console.log("signing up")
                const userExists = await findUser({ email })

                if (userExists) {
                    console.log("user exist")
                    return done(null, false)
                }

                const user = await createUser({
                    email,
                    password,
                })

                return done(null, user)
            } catch (error) {
                done(error)
            }
        }
    )
)

passport.use(
    "local-login",
    new LocalStrategy(
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
)

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader("authorization"),
            secretOrKey: process.env.JWT_SECRET,
        },
        async function (jwtPayload, done) {
            
            console.log("🚀 ~ file: passport.config.js:71 ~ jwtPayload:", jwtPayload)
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
)

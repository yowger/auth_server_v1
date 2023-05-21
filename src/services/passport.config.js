const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const { ExtractJwt } = require("passport-jwt")
const { findUser, createUser } = require("../model/user/user.model")

async function localSignUp(email, password, done) {
    try {
        console.log("signing up")
        const userExists = await findUser({ email })

        if (userExists) {
            console.log("user already exists")
            return done(null, false)
        }

        const user = await createUser({
            email,
            password,
        })

        return done(null, user)
    } catch (error) {
        console.log("🚀 ~ file: auth.router.js:81 ~ error:", error)
        done(error)
    }
}

async function localLogin(email, password, done) {
    try {
        const user = await findUser({ email })

        if (!user) {
            return done(null, false, {
                message: "user not found",
            })
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

async function verifyJwt(jwtPayload, done) {
    try {
        const user = jwtPayload.user
        console.log("🚀 ~ file: auth.router.js:109 ~ user:", user)
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}

passport.use(
    "local-signup",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        localSignUp
    )
)

passport.use(
    "local-login",
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        localLogin
    )
)

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader("authorization"),
            secretOrKey: "secretKey",
        },
        verifyJwt
    )
)

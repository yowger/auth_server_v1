function guestMiddleware(req, res, next) {
    const cookies = req.cookies
    const noJwtCookie = !cookies?.jwt

    if (noJwtCookie) {
        req.isGuest = true
        next()
    } else {
        console.log("im a user")
        req.isGuest = false
    }

    next()
}

module.exports = guestMiddleware

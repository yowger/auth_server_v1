function checkUserRole(allowedRoles) {
    return function (req, res, next) {
        if (!req.user.roles) {
            return res.status(401).json({ message: "User roles not available" })
        }

        const userRoles = req.user.roles.map((role) => role.toLowerCase())

        const isAuthorized = userRoles.some((role) =>
            allowedRoles
                .map((allowedRole) => allowedRole.toLowerCase())
                .includes(role)
        )

        if (!isAuthorized) {
            return res.status(403).json({ message: "Unauthorized" })
        }

        next()
    }
}

module.exports = checkUserRole

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
        console.log("🚀 ~ file: validate.js:4 ~ validate ~ error:", error)
        res.status(422).send(error.details[0].message)
    } else {
        next()
    }
}

module.exports = validate

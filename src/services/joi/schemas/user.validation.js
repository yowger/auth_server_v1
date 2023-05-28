const Joi = require("joi")

const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S]{5,}$/
// 5 or more characters, one uppercase, one lowercase, and one number

const specialCharsFormat = /^[-@.\w]*$/
// Password cannot contain special characters other than _ @ . -

const usernameRegex = /^[a-zA-Z0-9_-]+$/
// only lower and upper case letters, numbers and dash and underscore

const userValidation = Joi.object().keys({
    username: Joi.string()
        .required()
        .trim()
        .min(2)
        .max(20)
        .regex(usernameRegex)
        .messages({
            "string.pattern.base":
                "Only lowercase and uppercase letters, numbers, dashes and underscore are allowed",
        }),
    name: Joi.string().trim().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string()
        .required()
        .min(5)
        .max(20)
        .regex(specialCharsFormat)
        .regex(passwordFormat)
        .messages({
            "string.pattern.base":
                "Password must have 5 or more characters, at least one uppercase and lowercase letter, and one number. Only these special characters are allowed: _ @ . -",
        }),
})

module.exports = userValidation

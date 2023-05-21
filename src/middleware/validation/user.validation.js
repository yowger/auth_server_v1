// DONE
const Joi = require("joi")

const hasOneLetterRegex = /[ -~]*[a-z][ -~]*/
const hasOneUpperLetterRegex = /[ -~]*[A-Z][ -~]*/
const hasOneSpecialCharactersRegex = /[ -~]*(?=[ -~])[^0-9a-zA-Z][ -~]*/

const userValidation = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
        .required()
        .min(5)
        .max(20)
        .regex(hasOneLetterRegex)
        .regex(hasOneUpperLetterRegex)
        .regex(hasOneSpecialCharactersRegex)
        .messages({
            "string.pattern.base":
                "Password must have 1 small letter, 1 big letter, and 1 special character",
        }),
})

module.exports = userValidation

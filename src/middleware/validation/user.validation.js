const Joi = require("joi")

const userValidation = Joi.object().keys({
    username: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
})

module.exports = userValidation

const Joi = require('joi');

const userSchema = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).required()
});

const loginSchema = userSchema.fork(['firstname', 'lastname'], (schema) => schema.optional());

const roleSchema = Joi.object({
    role: Joi.number().integer().positive().required()
});

module.exports = { userSchema, loginSchema, roleSchema };

const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required()
});

const productUpdateSchema = productSchema
    .fork(['name', 'price', 'category'], (schema) => schema.optional())
    .min(1);

module.exports = { productSchema, productUpdateSchema };

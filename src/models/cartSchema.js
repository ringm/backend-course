import Joi from "joi";

export const productInCartSchema = Joi.object({
  qty: Joi.number().min(1).required(),
});

export const cartSchema = Joi.object({
  products: Joi.array().items(productInCartSchema),
});

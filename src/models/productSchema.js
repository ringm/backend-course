import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(1).required(),
  code: Joi.string().min(3).required(),
  price: Joi.number().min(0).required(),
  status: Joi.boolean().required(),
  stock: Joi.number().min(1).required(),
  category: Joi.string().min(3).required(),
});

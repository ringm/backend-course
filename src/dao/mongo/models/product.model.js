import mongoose from "mongoose";
import Joi from "joi";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  category: { type: String },
  status: { type: Boolean, default: true },
  stock: { type: Number, default: 1 },
  thumbnails: { type: [String], default: [] },
});

export const productModel = mongoose.model(productCollection, productSchema);

export const productJoiSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(1).required(),
  code: Joi.string().min(3).required(),
  price: Joi.number().min(0).required(),
  status: Joi.boolean().required(),
  stock: Joi.number().min(1).required(),
  category: Joi.string().min(3).required(),
  thumbnails: Joi.array().items(Joi.string()),
});

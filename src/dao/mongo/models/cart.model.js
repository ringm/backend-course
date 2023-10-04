import Joi from "joi";
import mongoose from "mongoose";

const cartCollection = "carts";

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  products: {
    type: [productSchema],
    default: [],
  },
});

export const cartModel = mongoose.model(cartCollection, cartSchema);

export const productInCartJoiSchema = Joi.object({
  quantity: Joi.number().min(1).required(),
});

export const cartJoiSchema = Joi.object({
  products: Joi.array().items(productInCartJoiSchema),
});

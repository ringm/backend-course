import Joi from "joi";
import mongoose from "mongoose";

const cartCollection = "carts";

const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
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

cartSchema.pre("findOne", function (next) {
  this.populate("products.productId");
  next();
});

export const cartModel = mongoose.model(cartCollection, cartSchema);

export const productInCartJoiSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
});

export const cartJoiSchema = Joi.object({
  products: Joi.array().items(productInCartJoiSchema),
});

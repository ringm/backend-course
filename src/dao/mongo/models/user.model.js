import mongoose from "mongoose";
import Joi from "joi";

const userCollections = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
});

export const userModel = mongoose.model(userCollections, userSchema);

export const userJoiSchema = Joi.object({
  first_name: Joi.string().min(3).required(),
  last_name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(18).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").required(),
});

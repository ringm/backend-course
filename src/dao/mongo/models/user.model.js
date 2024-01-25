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
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  last_connection: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ["pending", "incomplete", "complete"],
    default: "pending"
  },
  documents: {
    type: [
      {
        name: {
          type: String,
          required: true
        },
        reference: {
          type: String,
          required: true
        }
      }
    ],
    default: []
  }
});

export const userModel = mongoose.model(userCollections, userSchema);

export const userJoiSchema = Joi.object({
  first_name: Joi.string().min(3).required(),
  last_name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(18).required(),
  password: Joi.string().min(6).required(),
});

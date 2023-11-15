import mongoose from "mongoose";

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
    required: true,
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

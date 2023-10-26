import mongoose from "mongoose";

const userCollections = "users";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

export const userModel = mongoose.model(userCollections, userSchema);

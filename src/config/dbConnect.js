import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ringmartin:S2R8jLxDyZmBSUKz@coderhouseecommerce.olnda9k.mongodb.net/ecommerce?retryWrites=true&w=majority",
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

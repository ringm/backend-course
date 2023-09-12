import { areValuesValid } from "../helpers/validation.js";
import { productSchema } from "../models/productSchema.js";

export const hasProductValues = (req, res, next) => {
  const errors = areValuesValid(req.body, productSchema);
  if (errors.length === 0) {
    next();
  } else {
    res.status(400).json({ error: "Bad request", details: errors });
  }
};

import { areValuesValid } from "../helpers/validation.js";
import { productJoiSchema } from "../models/product.model.js";

export const hasProductValues = (req, res, next) => {
  const errors = areValuesValid(req.body, productJoiSchema);
  if (errors.length === 0) {
    next();
  } else {
    res.status(400).json({ error: "Bad request", details: errors });
  }
};

import { ProductManager } from "../lib/ProductManager.js";
import { __dirname } from "../utils.js";

const Manager = new ProductManager(`${__dirname}/data/products.json`);

export const productExists = async (req, res, next) => {
  const product = await Manager.getProductById(parseInt(req.params.pid));
  if (product) {
    next();
  } else {
    res.status(404).json({ error: "Not found", details: "Product not found." });
  }
};

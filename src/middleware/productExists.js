import { productService } from "../services/index.js";

export const productExists = async (req, res, next) => {
  const product = await productService.getProductById(req.params.pid);
  if (product) {
    next();
  } else {
    res.status(404).json({ error: "Not found", details: "Product not found." });
  }
};

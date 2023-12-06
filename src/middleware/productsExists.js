import { productService } from "../services/index.js";

export const productsExists = async (req, res, next) => {
  try {
    const products = req.body?.products;
    for (const product of products) {
      await productService.getById(product.productId);
    }
    next();
  } catch (e) {
    res.status(404).json({ error: "Not found", details: e.message });
  }
};

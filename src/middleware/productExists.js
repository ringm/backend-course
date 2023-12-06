import { productService } from "../services/index.js";

export const productExists = async (req, res, next) => {
  try {
    await productService.getById(req.params.pid);
    next();
  } catch (e) {
    res.status(404).json({ error: "Not found", details: e.message });
  }
};

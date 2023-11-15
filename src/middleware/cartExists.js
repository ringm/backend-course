import { cartService } from "../services/index.js";

export const cartExists = async (req, res, next) => {
  const cart = await cartService.getCartById(req.params.cid);
  if (cart) {
    next();
  } else {
    res.status(404).json({ error: "Not found", details: "Cart not found." });
  }
};

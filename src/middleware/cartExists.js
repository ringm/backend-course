import { CartManager } from "../lib/CartManager.js";
import { __dirname } from "../utils.js";

const Manager = new CartManager(`${__dirname}/data/carts.json`);

export const cartExists = async (req, res, next) => {
  const cart = await Manager.getCartById(parseInt(req.params.cid));
  if (cart) {
    next();
  } else {
    res.status(404).json({ error: "Not found", details: "Cart not found." });
  }
};

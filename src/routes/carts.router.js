import { Router } from "express";
import { CartManager } from "../lib/CartManager.js";
import { productInCartSchema } from "../models/cartSchema.js";
import { __dirname } from "../utils.js";
import { cartExists } from "../middleware/cartExists.js";
import { productExists } from "../middleware/productExists.js";

const router = Router();
const Manager = new CartManager(`${__dirname}/data/carts.json`);

router.post("/", async (req, res) => {
  try {
    const newCart = await Manager.addCart();
    if (newCart) {
      res.status(200).json({ message: "Cart added", cart: newCart });
    } else {
      res.status(500).json({ error: "An error ocurred.", details: "Internal server error." });
    }
  } catch (e) {
    res.status(e.status).json({ message: "An error ocurred.", details: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cart = await Manager.getCartById(parseInt(req.params.id));
    if (cart) {
      res.status(200).json({ cart: cart });
    } else {
      res.status(404).json({ error: "Cart not found", details: "Invalid ID" });
    }
  } catch (e) {
    res.status(e.status).json({ message: "An error ocurred.", details: e.message });
  }
});

router.post("/:cid/product/:pid", cartExists, productExists, async (req, res) => {
  try {
    const { error } = productInCartSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({ error: "Bad request", details: error.details.map((e) => e.message) });
    } else {
      const cart = await Manager.addProductToCart(
        parseInt(req.params.cid),
        parseInt(req.params.pid),
        req.body.quantity,
      );
      if (cart) {
        res.status(200).json({ message: "Product added to cart", cart });
      } else {
        res.status(400).json({ error: "An error ocurred.", deatils: "Could not add product to the cart." });
      }
    }
  } catch (e) {
    res.status(e.status).json({ message: "An error ocurred.", details: e.message });
  }
});

export { router as cartsRouter };

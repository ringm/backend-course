import { Router } from "express";
import { CartManager } from "../lib/CartManager.js";
import { productInCartSchema } from "../models/cartSchema.js";

const router = Router();
const Manager = new CartManager("./src/data/carts.json");

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

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { error } = productInCartSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({ error: "Bad request", details: error.details.map((e) => e.message) });
    } else {
      const cart = await Manager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid), req.body.qty);
      if (cart) {
        res.status(200).json({ message: "Product added to cart", cart: cart });
      } else {
        res.status(400).json({ error: "An error ocurred.", deatils: "Could not add product to the cart." });
      }
    }
  } catch (e) {
    res.status(e.status).json({ message: "An error ocurred.", details: e.message });
  }
});

export { router as cartsRouter };

import { Router } from "express";
import { productInCartJoiSchema } from "../dao/mongo/models/cart.model.js";
import { __dirname } from "../utils.js";
import { cartExists } from "../middleware/cartExists.js";
import { productExists } from "../middleware/productExists.js";
import { cartService } from "../dao/index.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    if (newCart) {
      res.status(200).json({ message: "Cart added", cart: newCart });
    } else {
      res.status(500).json({ error: "An error ocurred.", details: "Internal server error." });
    }
  } catch (e) {
    res.status(500).json({ message: "An error ocurred.", details: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.id);
    if (cart) {
      res.status(200).json({ cart: cart });
    } else {
      res.status(404).json({ error: "Cart not found", details: "Invalid ID" });
    }
  } catch (e) {
    res.status(500).json({ message: "An error ocurred.", details: e.message });
  }
});

router.post("/:cid/product/:pid", cartExists, productExists, async (req, res) => {
  try {
    const { error } = productInCartJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({ error: "Bad request", details: error.details.map((e) => e.message) });
    } else {
      const cart = await cartService.addProductToCart(req.params.cid, {
        productId: req.params.pid,
        quantity: req.body.quantity,
      });
      if (cart) {
        res.status(200).json({ message: "Product added to cart", cart });
      } else {
        res.status(400).json({ error: "An error ocurred.", deatils: "Could not add product to the cart." });
      }
    }
  } catch (e) {
    res.status(500).json({ message: "An error ocurred.", details: e.message });
  }
});

export { router as cartsRouter };

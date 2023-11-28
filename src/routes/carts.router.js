import { Router } from "express";
import { productInCartJoiSchema } from "../dao/mongo/models/cart.model.js";
import { cartExists } from "../middleware/cartExists.js";
import { productExists } from "../middleware/productExists.js";
import { cartService } from "../services/index.js";
import { productService } from "../services/index.js";
import { isUser } from "../middleware/isUser.js";
import passport from "passport";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartService.create();
    if (newCart) {
      res.status(200).json({ message: "Cart added", cart: newCart });
    } else {
      res.status(500).json({ error: "An error ocurred.", details: "Internal server error." });
    }
  } catch (e) {
    res.status(500).json({ message: "An error ocurred.", details: e.message });
  }
});

router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const cart = await cartService.get(req.params.id);
    if (cart) {
      res.status(200).send(cart);
    } else {
      res.status(404).json({ error: "Cart not found", details: "Invalid ID" });
    }
  } catch (e) {
    res.status(500).json({ message: "An error ocurred.", details: e.message });
  }
});

router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  isUser,
  cartExists,
  productExists,
  async (req, res) => {
    try {
      const { error } = productInCartJoiSchema.validate(req.body, { abortEarly: false });
      if (error) {
        res.status(400).json({ error: "Bad request", details: error.details.map((e) => e.message) });
      } else {
        const cart = await cartService.addProduct(req.params.cid, {
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
  },
);

router.put("/:cid", passport.authenticate("jwt", { session: false }), isUser, cartExists, async (req, res) => {
  try {
    const products = req.body?.products || {};
    const cart = await cartService.update(req.params.cid, products);
    if (cart) {
      res.status(200).json({ message: "Cart Updated", cart });
    } else {
      res.status(400).json({ error: "An error ocurred.", deatils: "Could not update products from the cart." });
    }
  } catch (e) {
    res.status(500).json({ message: "An error ocurred.", details: e.message });
  }
});

router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  isUser,
  cartExists,
  async (req, res) => {
    try {
      const cart = await cartService.get(req.params.cid);
      const prods = [...cart.products];
      const filteredCart = prods.filter(async (product) => {
        const p = await productService.getById(product._id);
        return product.quantity <= p.stock;
      });
      res.status(200).json({ message: "cart", cart: filteredCart });
    } catch (e) {
      res.status(500).json({ message: "An error ocurred.", details: e.message });
    }
  },
);

export { router as cartsRouter };

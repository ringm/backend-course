import { Router } from "express";
import { asyncMiddleware } from "../middleware/async.js";
import { productService } from "../services/index.js";
import { cartService } from "../services/index.js";
import { isAdmin } from "../middleware/isAdmin.js";
import passport from "passport";

const router = Router();

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const products = await productService.get(req.query);
    const { docs, ...rest } = products;
    res.status(200).json({ status: "success", payload: docs, ...rest });
  }),
);

router.get(
  "/mock/:amount",
  asyncMiddleware(async (req, res) => {
    const fakeProducts = productService.createFake(req.params.amount);
    res.status(200).json({ status: "success", message: "fake products", payload: fakeProducts });
  }),
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const product = await productService.getById(req.params.id);
    res.status(200).json(product);
  }),
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  asyncMiddleware(async (req, res) => {
    await productService.validate(req.body);
    const product = await productService.create(req.body);
    res.status(200).json({ message: "Product added", payload: product });
  }),
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  asyncMiddleware(async (req, res) => {
    const updatedProduct = await productService.update(
      req.params.id,
      req.body
    );
    res.status(200).json({ message: "Product updated", product: updatedProduct });
  }),
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  asyncMiddleware(async (req, res) => {
    await cartService.deleteProductFromAllCarts(req.params.id);
    const deletedProduct = await productService.delete(req.params.id);
    res.status(200).json({ message: "Product deleted", product: deletedProduct });
  }),
);

export { router as productsRouter };

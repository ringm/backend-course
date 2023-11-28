import { Router } from "express";
import { uploader } from "../middleware/uploader.js";
import { productService } from "../services/index.js";
import { isAdmin } from "../middleware/isAdmin.js";
import passport from "passport";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productService.get(req.query);
    if (products) {
      const { docs, ...rest } = products;
      res.status(200).json({ status: "success", payload: docs, ...rest });
    } else {
      throw new Error("Could not connect to the database.");
    }
  } catch (e) {
    res.status(500).json({ message: "Internal server error", details: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await productService.getById(req.params.id);
    res.status(200).json({ product: product });
  } catch (e) {
    res.status(404).json({ message: "Not found.", details: e.message });
  }
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  uploader.array("thumbnails"),
  async (req, res) => {
    try {
      const { error } = productService.validate(req.body);
      if (error) {
        res.status(400).json({ error: "Bad request", details: error.details.map((e) => e.message) });
      } else {
        let thumbnails = [];
        if (req.files?.length > 0) {
          thumbnails = productService.uploadImages(req.files);
        }
        const product = await productService.create({ ...req.body, thumbnails });
        res.status(200).json({ message: "Product added", payload: product });
      }
    } catch (e) {
      res.status(500).json({ message: "An error ocurred.", details: e.message });
    }
  },
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  uploader.array("thumbnails"),
  async (req, res) => {
    try {
      let thumbnails = [];
      if (req.files?.length > 0) {
        thumbnails = productService.uploadImages(req.files);
      }
      const updatedProduct = await productService.update(req.params.id, { ...req.body, thumbnails });
      if (updatedProduct) {
        res.status(200).json({ message: "Product updated", product: updatedProduct });
      } else {
        res.status(404).json({ message: "Product not fonud.", details: "Invalid ID." });
      }
    } catch (e) {
      res.status(500).json({ message: "An error ocurred.", details: e.message });
    }
  },
);

router.delete("/:id", passport.authenticate("jwt", { session: false }), isAdmin, async (req, res) => {
  try {
    const deletedProduct = await productService.delete(req.params.id);
    if (deletedProduct) {
      res.status(200).json({ message: "Product deleted", product: deletedProduct });
    } else {
      res.status(404).json({ message: "Product not fonud.", details: "Invalid ID." });
    }
  } catch (e) {
    res.status(500).json({ message: "An error ocurred.", details: e.message });
  }
});

export { router as productsRouter };

import { Router } from "express";
import { ProductManager } from "../lib/ProductManager.js";
import { productSchema } from "../models/productSchema.js";
import { hastValidProperty } from "../helpers/validation.js";

const router = Router();
const Manager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await Manager.getProducts(parseInt(limit));
    if (products) {
      res.status(200).json({ products: products });
    } else {
      throw new Error("Could not connect to the database.");
    }
  } catch (e) {
    res.status(500).json({ message: "Internal server error", details: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Manager.getProductById(parseInt(req.params.id));
    res.status(200).json({ product: product });
  } catch (e) {
    res.status(e.status).json({ message: "An error ocurred.", details: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({ error: "Bad request", details: error.details.map((e) => e.message) });
    } else {
      const product = await Manager.addProduct(req.body);
      res.status(200).json({ message: "Product added", product: product });
    }
  } catch (e) {
    res.status(e.status).json({ message: "An error ocurred.", details: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (hastValidProperty(req.body, productSchema)) {
      const updatedProduct = await Manager.updateProduct(parseInt(req.params.id), req.body);
      if (updatedProduct) {
        res.status(200).json({ message: "Product updated", product: updatedProduct });
      } else {
        res.status(404).json({ message: "Product not fonud.", details: "Invalid ID." });
      }
    } else {
      res.status(400).json({ error: "Bad request", message: "Invalid properties" });
    }
  } catch (e) {
    res.status(e.status).json({ message: "An error ocurred.", details: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Manager.deleteProduct(parseInt(req.params.id));
    if (deletedProduct) {
      res.status(200).json({ message: "Product deleted", product: deletedProduct });
    } else {
      res.status(404).json({ message: "Product not fonud.", details: "Invalid ID." });
    }
  } catch (e) {
    res.status(e.status).json({ message: "An error ocurred.", details: e.message });
  }
});

export { router as productsRouter };

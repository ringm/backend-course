import { Router } from "express";
import { productJoiSchema } from "../models/product.model.js";
import { uploader } from "../middleware/uploader.js";
import { __dirname } from "../utils.js";
import { hasProductValues } from "../middleware/hasProductValues.js";
import { productService } from "../services/index.js";
import { v2 as cloudinary } from "cloudinary";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productService.getProducts(req.query);
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
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ product: product });
  } catch (e) {
    res.status(404).json({ message: "Not found.", details: e.message });
  }
});

router.post("/", uploader.array("thumbnails"), async (req, res) => {
  try {
    const { error } = productJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({ error: "Bad request", details: error.details.map((e) => e.message) });
    } else {
      let thumbnails = [];
      if (req.files?.length > 0) {
        thumbnails = await Promise.all(
          req.files.map((file) => {
            return new Promise((res, rej) => {
              cloudinary.uploader.upload(file.path, { folder: req.body.name }, (err, result) => {
                if (err) {
                  console.error("Error uploading to Cloudinary:", err);
                  rej("Upload failed");
                }
                res(result?.public_id);
              });
            });
          }),
        );
      }
      const product = await productService.createProduct({ ...req.body, thumbnails });
      res.status(200).json({ message: "Product added", payload: product });
    }
  } catch (e) {
    res.status(500).json({ message: "An error ocurred.", details: e.message });
  }
});

router.put("/:id", hasProductValues, uploader.array("thumbnails"), async (req, res) => {
  try {
    let thumbnails = [];
    if (req.files?.length > 0) {
      thumbnails = await Promise.all(
        req.files.map((file) => {
          return new Promise((res, rej) => {
            cloudinary.uploader.upload(file.path, { folder: req.body.name }, (err, result) => {
              if (err) {
                console.error("Error uploading to Cloudinary:", err);
                rej("Upload failed");
              }
              res(result?.public_id);
            });
          });
        }),
      );
    }
    const updatedProduct = await productService.updateProduct(req.params.id, { ...req.body, thumbnails });
    if (updatedProduct) {
      res.status(200).json({ message: "Product updated", product: updatedProduct });
    } else {
      res.status(404).json({ message: "Product not fonud.", details: "Invalid ID." });
    }
  } catch (e) {
    res.status(500).json({ message: "An error ocurred.", details: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
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

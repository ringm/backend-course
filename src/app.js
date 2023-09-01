import express from "express";
import { ProductManager } from "../lib/ProductManager.js";

const PORT = 8080;
const app = express();
const manager = new ProductManager("./data/products.json");

app.get("/products", async (req, res) => {
  const { limit } = req.query;
  const products = await manager.getProducts(limit);
  if (products) {
    res.status(200).json(products);
  } else {
    res.status(500).json({ error: "Internal server error", message: "Could not connect to the database." });
  }
});

app.get("/products/:id", async (req, res) => {
  const product = await manager.getProductById(parseInt(req.params.id));
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ error: "Not found", message: "Product not found." });
  }
});

app.listen(PORT, () => console.log("server running"));

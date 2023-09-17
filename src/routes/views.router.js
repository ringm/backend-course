import express from "express";
import { ProductManager } from "../lib/ProductManager.js";
import { __dirname } from "../utils.js";
import { formatMoney } from "../helpers/format.js";

const router = express.Router();
const PManager = new ProductManager(`${__dirname}/data/products.json`);

router.get("/", async (req, res) => {
  const products = await PManager.getProducts();
  const formatedPriceProducts = products.map((p) => {
    return { ...p, price: formatMoney(p.price) };
  });
  res.render("index", { products: formatedPriceProducts });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts", {});
});

export { router as viewsRouter };

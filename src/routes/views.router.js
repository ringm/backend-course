import express from "express";
import { __dirname } from "../utils.js";
import { formatMoney } from "../helpers/format.js";
import { productService } from "../dao/index.js";
import { chatService } from "../dao/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await productService.getProducts();
  const formatedPriceProducts = products.map((p) => {
    const { name, description, price, thumbnails } = p;
    return { name, description, thumbnails, price: formatMoney(price) };
  });
  res.render("index", { products: formatedPriceProducts });
});

router.get("/chat", async (req, res) => {
  const messages = await chatService.getMessages();
  res.render("chat", { messages: messages });
});

export { router as viewsRouter };

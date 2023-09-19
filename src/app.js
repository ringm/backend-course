import express from "express";
import handlebars from "express-handlebars";
import fs from "fs";
import { Server } from "socket.io";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { __dirname } from "./utils.js";
import { viewsRouter } from "./routes/views.router.js";
import { ProductManager } from "./lib/ProductManager.js";

const PORT = 8080;
const app = express();

const PManager = new ProductManager(`${__dirname}/data/products.json`);

const httpServer = app.listen(PORT, () => console.log("server running"));
const socketServer = new Server(httpServer);

const hbs = handlebars.create();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
app.set("views", __dirname + "/views");
app.set("view engine", ".hbs");
hbs.handlebars.registerPartial("card", fs.readFileSync(__dirname + "/views/partials/card.hbs", "utf8"));

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

socketServer.on("connection", (socket) => {
  console.log("nuevo cliente conectado");

  socket.on("get-products", async () => {
    const products = await PManager.getProducts();
    socket.emit("render-products", products);
  });

  socket.on("create-product", async (data) => {
    await PManager.addProduct(data);
    const products = await PManager.getProducts();
    socket.emit("render-products", products);
  });

  socket.on("delete-product", async (id) => {
    await PManager.deleteProduct(id);
    const products = await PManager.getProducts();
    socket.emit("render-products", products);
  });
});

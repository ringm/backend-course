import express from "express";
import handlebars from "express-handlebars";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./config/dbConnect.js";
import { Server } from "socket.io";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { __dirname } from "./utils.js";
import { viewsRouter } from "./routes/views.router.js";
import { chatService } from "./dao/index.js";

dotenv.config();

let port = process.env.PORT;

if (port == null || port == "") {
  port = 8080;
}

const app = express();

app.use(
  cors({
    origin: ["https://coderhouse-ecommerce-front.vercel.app", "http://localhost:3000"], // Change this to the domain you want to allow
  }),
);

const httpServer = app.listen(port, () => console.log("server running"));
const socketServer = new Server(httpServer);

const hbs = handlebars.create();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
app.set("views", __dirname + "/views");
app.set("view engine", ".hbs");
hbs.handlebars.registerPartial("card", fs.readFileSync(__dirname + "/views/partials/card.hbs", "utf8"));

connectToDatabase();

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

socketServer.on("connection", (socket) => {
  console.log("nuevo cliente conectado");

  socket.on("get-messages", async () => {
    const messages = await chatService.getMessages();
    socket.emit("render-messages", messages);
    socket.broadcast.emit("render-messages", messages);
  });

  socket.on("create-message", async (message) => {
    await chatService.createMessage(message);
    const messages = await chatService.getMessages();
    socket.emit("render-messages", messages);
    socket.broadcast.emit("render-messages", messages);
  });
});

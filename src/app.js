import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectToDatabase } from "./config/dbConnect.js";
import { Server } from "socket.io";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import { __dirname } from "./utils.js";
import { chatService } from "./dao/index.js";

dotenv.config();

let port = process.env.PORT;

if (port == null || port == "") {
  port = 8080;
}

const app = express();

const httpServer = app.listen(port, () => console.log("server running"));
const socketServer = new Server(httpServer);

const hbs = handlebars.create();

app.use(
  cors({
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
    origin: ["https://coderhouse-ecommerce-front.vercel.app", "http://localhost:3000"],
  }),
);

app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 15 * 1000 * 60,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, sameSite: "none", httpOnly: true },
    // cookie: { secure: true, httpOnly: true, sameSite: "none" },
  }),
);

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
app.use("/api/sessions", sessionsRouter);

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

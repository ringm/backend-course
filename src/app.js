import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import { connectToDatabase } from "./config/dbConnect.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { usersRouter } from "./routes/users.router.js";
import { __dirname } from "./utils.js";
import { initializePassport } from "./config/passport.config.js";
import { Server } from "socket.io";
import { chatService } from "./dao/index.js";
import handlebars from "express-handlebars";
import fs from "fs";
import session from "express-session";
import MongoStore from "connect-mongo";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

let port = process.env.PORT;
const isDEV = port == null || port == "" ? true : false;

if (isDEV) {
  port = 8080;
}

const app = express();

const httpServer = app.listen(port, () => console.log("server running"));
// const socketServer = new Server(httpServer);

app.use(
  cors({
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Access-Control-Allow-Origin",
    ],
    origin: [
      "https://ringm.com.ar",
      "https://coderhouse-ecommerce.ringm.com.ar",
      "https://coderhouse-ecommerce-front-ringm.vercel.app",
      "https://coderhouse-ecommerce-front.vercel.app",
      "https://coderhouse-ecommerce-front-git-main-ringm.vercel.app",
      "http://localhost:3000",
    ],
  }),
);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 15 * 1000 * 60,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: isDEV ? {} : { secure: true, sameSite: "none", httpOnly: true, path: "/" },
  }),
);

app.set("trust proxy", 1);

app.use(cookieParser());

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

connectToDatabase();

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);

cloudinary.config({
  cloud_name: "dvun2e5kw",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// socketServer.on("connection", (socket) => {
//   console.log("nuevo cliente conectado");

//   socket.on("get-messages", async () => {
//     const messages = await chatService.getMessages();
//     socket.emit("render-messages", messages);
//     socket.broadcast.emit("render-messages", messages);
//   });

//   socket.on("create-message", async (message) => {
//     await chatService.createMessage(message);
//     const messages = await chatService.getMessages();
//     socket.emit("render-messages", messages);
//     socket.broadcast.emit("render-messages", messages);
//   });
// });

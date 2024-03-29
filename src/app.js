import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import compression from "express-compression";
import nodemailer from 'nodemailer';
import { connectToDatabase } from "./config/dbConnect.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { usersRouter } from "./routes/users.router.js";
import { loggerRouter } from "./routes/logger.router.js";
import { __dirname } from "./utils.js";
import { initializePassport } from "./config/passport.config.js";
import { v2 as cloudinary } from "cloudinary";
import { error } from "./middleware/error.js";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpecs } from "./swagger/swagger.js";

dotenv.config();

let port = process.env.PORT;
const isDEV = port == null || port == "" ? true : false;

if (isDEV) {
  port = 8080;
}

const app = express();

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(port, () => console.log("server running"));

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
      "http://localhost:3000",
    ],
  }),
);

app.set("trust proxy", 1);

app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  }),
);

app.use(cookieParser());

initializePassport();

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

connectToDatabase();

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/logger", loggerRouter);

app.use(error);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  },
})
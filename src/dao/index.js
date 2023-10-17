import { ProductManagerMongo } from `${__dirname}` + "/mongo/productManagerMongo.js";
import { ChatManagerMongo } from "./mongo/ChatManagerMongo.js";
import { CartManagerMongo } from "./mongo/CartManagerMongo.js";

export const productService = new ProductManagerMongo();
export const chatService = new ChatManagerMongo();
export const cartService = new CartManagerMongo();

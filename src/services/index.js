import { ProductManagerMongo } from "../controllers/ProductManagerMongo.js";
import { ChatManagerMongo } from "../controllers/ChatManagerMongo.js";
import { CartManagerMongo } from "../controllers/CartManagerMongo.js";
import { UserManagerMongo } from "../controllers/UserManagerMongo.js";

export const productService = new ProductManagerMongo();
export const chatService = new ChatManagerMongo();
export const cartService = new CartManagerMongo();
export const userService = new UserManagerMongo();

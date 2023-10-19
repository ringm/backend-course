import { ProductManagerMongo } from "./mongo/ProductManagerMongo.js";
import { ChatManagerMongo } from "./mongo/ChatManagerMongo.js";
import { CartManagerMongo } from "./mongo/CartManagerMongo.js";
import { UserManagerMongo } from "./mongo/UserManagerMongo.js";

export const productService = new ProductManagerMongo();
export const chatService = new ChatManagerMongo();
export const cartService = new CartManagerMongo();
export const userService = new UserManagerMongo();

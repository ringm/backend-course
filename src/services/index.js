import { ProductController } from "../dao/mongo/controllers/product.controller.mongo.js";
import { ChatController } from "../dao/mongo/controllers/chat.controller.mongo.js";
import { CartController } from "../dao/mongo/controllers/cart.controller.mongo.js";
import { UserController } from "../dao/mongo/controllers/user.controller.mongo.js";
import { TicketController } from "../dao/mongo/controllers/ticket.controller.mongo.js";

export const productService = new ProductController();
export const chatService = new ChatController();
export const cartService = new CartController();
export const userService = new UserController();
export const ticketService = new TicketController();

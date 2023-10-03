import { cartModel } from "./models/cart.model.js";

export class CartManagerMongo {
  constructor() {
    this.model = cartModel;
  }

  async createCart() {
    try {
      const result = await this.model.create({});
      return result;
    } catch (e) {
      throw new Error("Couldn't create cart.");
    }
  }

  async addProductToCart(id, product) {
    try {
      const cart = await this.model.findById(id);
      const existingProductIndex = cart.products.findIndex((p) => p.productId === product.productId);

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity = product.quantity;
      } else {
        cart.products.push(product);
      }

      const result = await this.model.findByIdAndUpdate(id, cart, { new: true });

      if (!result) {
        throw new Error("Couldn't add product to cart.");
      }
      return result;
    } catch (e) {
      throw new Error("Couldn't add product to cart.");
    }
  }

  async getCartById(id) {
    try {
      const result = await this.model.findById(id);
      return result;
    } catch (e) {
      throw new Error("Cart not found.");
    }
  }
}

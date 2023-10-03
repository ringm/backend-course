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
      const result = await this.model.findByIdAndUpdate(id, { $push: { products: product } }, { new: true });
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

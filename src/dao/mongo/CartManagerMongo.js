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

  async addProductToCart(cid, product) {
    try {
      const cart = await this.model.findById(cid);
      const existingProductIndex = cart.products.findIndex((p) => p.productId._id.toString() === product.productId);

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity = product.quantity;
      } else {
        cart.products.push(product);
      }

      const result = await this.model.findByIdAndUpdate(cid, { products: cart.products }, { new: true });

      if (!result) {
        throw new Error("Couldn't add product to cart.");
      }
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async deleteProduct(cid, pid) {
    try {
      const cart = await this.model.findById(cid);
      const productIdx = cart.products.findIndex((p) => p.productId === pid);

      const result = await this.model.findByIdAndUpdate(
        cid,
        { products: cart.products.splice(productIdx, 1) },
        { new: true },
      );

      if (!result) {
        throw new Error("Couldn't remove product from cart.");
      }
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getCartById(cid) {
    try {
      const result = await this.model.findById(cid);
      return result;
    } catch (e) {
      throw new Error("Cart not found.");
    }
  }

  async emptyCart(cid) {
    try {
      const result = this.model.findByIdAndUpdate(cid, { products: [] }, { new: true });
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

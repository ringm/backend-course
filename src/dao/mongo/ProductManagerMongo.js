import { productModel } from "./models/product.model.js";

export class ProductManagerMongo {
  constructor() {
    this.model = productModel;
  }

  async createProduct(product) {
    try {
      const result = await this.model.create(product);
      return result;
    } catch (e) {
      throw new Error("Couldn't create product.");
    }
  }

  async updateProduct(id, product) {
    try {
      const result = await this.model.findByIdAndUpdate(id, product, { new: true });
      if (!result) {
        throw new Error("Couldn't find product.");
      }
      return result;
    } catch (e) {
      throw new Error("Couldn't update product.");
    }
  }

  async deleteProduct(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result;
    } catch (e) {
      throw new Error("Couldn't delete product.");
    }
  }

  async getProducts(limit) {
    try {
      const result = await this.model.find();
      return result;
    } catch (e) {
      throw new Error("Couldn't retrieve products.");
    }
  }

  async getProductById(id) {
    try {
      const result = await this.model.findById(id);
      return result;
    } catch (e) {
      throw new Error("Product not found.");
    }
  }
}

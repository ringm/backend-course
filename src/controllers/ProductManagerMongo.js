import { productModel } from "../models/product.model.js";

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

  async getProducts(params) {
    try {
      const { limit, page, sort, category } = params;

      const results = await this.model.paginate(category ? { category: category } : {}, {
        sort: {
          price: sort ?? 1,
        },
        page: page ?? 1,
        limit: limit ?? 10,
        lean: true,
      });

      return results;
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

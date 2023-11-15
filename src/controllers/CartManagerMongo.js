import { cartModel } from "../models/cart.model.js";
import mongoose from "mongoose";

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
      const cart = await this.model.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(cid) },
        },
        {
          $unwind: {
            path: "$products",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: {
            path: "$productDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            "productDetails.quantity": {
              $ifNull: ["$products.quantity", 0],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            products: { $push: "$productDetails" },
            totalQuantity: { $sum: { $ifNull: ["$products.quantity", 0] } },
            totalPrice: {
              $sum: {
                $multiply: [{ $ifNull: ["$products.quantity", 0] }, { $ifNull: ["$productDetails.price", 0] }],
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            totalQuantity: 1,
            totalPrice: 1,
            products: {
              $filter: {
                input: "$products",
                as: "product",
                cond: { $ne: ["$$product.quantity", 0] },
              },
            },
          },
        },
      ]);

      if (cart.length === 0) {
        throw new Error("Cart not found.");
      }

      return cart[0];
    } catch (e) {
      throw e;
    }
  }

  async updateCart(cid, products) {
    try {
      const result = await this.model.findByIdAndUpdate(cid, { products: products }, { new: true });
      return result;
    } catch (e) {
      throw new Error(e.message);
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

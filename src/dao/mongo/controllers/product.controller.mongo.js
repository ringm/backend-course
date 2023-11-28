import { productModel, productJoiSchema } from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";

export class ProductController {
  constructor() {
    this.model = productModel;
  }

  async create(product) {
    try {
      const result = await this.model.create(product);
      return result;
    } catch (e) {
      throw new Error("Couldn't create product.");
    }
  }

  async get(params) {
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

  async getById(id) {
    try {
      const result = await this.model.findById(id);
      return result;
    } catch (e) {
      throw new Error("Product not found.");
    }
  }

  async update(id, product) {
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

  async delete(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result;
    } catch (e) {
      throw new Error("Couldn't delete product.");
    }
  }

  async validate(product) {
    return productJoiSchema.validate(product, { abortEarly: false });
  }

  async uploadImages(images) {
    const thumbnails = await Promise.all(
      images.map((file) => {
        return new Promise((res, rej) => {
          cloudinary.uploader.upload(file.path, { folder: req.body.name }, (err, result) => {
            if (err) {
              console.error("Error uploading to Cloudinary:", err);
              rej("Upload failed");
            }
            res(result?.public_id);
          });
        });
      }),
    );
    return thumbnails;
  }
}

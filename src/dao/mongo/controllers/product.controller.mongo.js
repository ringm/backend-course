import { productModel, productJoiSchema } from "../models/product.model.js";
import { fakerES_MX as faker } from "@faker-js/faker";
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
        throw new Error("Product not found.");
      }
      return result;
    } catch (e) {
      throw new Error("Couldn't update product.");
    }
  }

  async delete(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      if (!result) {
        throw new Error("Product not found.");
      }
      return result;
    } catch (e) {
      throw new Error("Couldn't delete product.");
    }
  }

  createFake(amount = 1) {
    let products = [];
    for (let i = 0; i < amount; i++) {
      const product = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.commerce.isbn(),
        price: faker.commerce.price({ min: 1000, max: 1000000, dec: 0 }),
        category: faker.commerce.department(),
        status: true,
        stock: faker.number.int({ min: 1, max: 1000 }),
        thumbnails: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.image.url()),
      };
      products.push(product);
    }
    return products;
  }

  async validate(product) {
    const { error } = await productJoiSchema.validateAsync(product, { abortEarly: false });
    if (error) {
      throw new Error("que pesu");
      //throw new Error(`Bad request: ${error.details.map((e) => e.message)}`);
    }
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

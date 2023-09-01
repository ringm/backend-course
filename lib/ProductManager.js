import fs from "fs";

export class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
  }

  #fileExists() {
    return fs.existsSync(this.filePath);
  }

  #readProducts() {
    const products = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(products);
  }

  async #saveProducts(products) {
    await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, "\t"));
  }

  async addProduct(title, price, code, description = "", thumbnail = "Sin imágen", stock = 1) {
    const createID = (products) => {
      const prodsLen = products.length;
      if (prodsLen === 0) {
        return 1;
      } else {
        return products[prodsLen - 1].id + 1;
      }
    };

    try {
      if (this.#fileExists()) {
        const products = this.#readProducts();
        const product = { id: createID(products), title, description, price, thumbnail, code, stock };
        const productInStock = products.find((p) => p.code === product.code);

        if (productInStock) {
          throw new Error("Product already in stock.");
        }

        products.push(product);
        await this.#saveProducts(products);
        this.products = products;
        console.log("Product added!");
      } else {
        throw new Error("File not found.");
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async updateProduct(id, product) {
    try {
      if (this.#fileExists()) {
        const products = await this.#readProducts();
        const productToUpdate = products.find((p) => p.id === id);

        if (!productToUpdate) {
          throw new Error("Product not found.");
        }

        Object.keys(product).map((key) => {
          if (productToUpdate.hasOwnProperty(key) && key !== "id") {
            productToUpdate[key] = product[key];
          }
        });

        await this.#saveProducts(products);
        this.products = products;
        console.log("Product updated!");
      } else {
        throw new Error("File not found.");
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async deleteProduct(id) {
    try {
      if (this.#fileExists()) {
        const products = this.#readProducts();
        const newProducts = products.filter((p) => p.id !== id);

        if (products.length === newProducts.length) {
          throw new Error("Product not found.");
        }

        await this.#saveProducts(newProducts);
        console.log("Product deleted succesfully.");
      } else {
        throw new Error("File not found.");
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async getProducts(limit = undefined) {
    try {
      if (this.#fileExists()) {
        const products = this.#readProducts();
        return limit ? products.slice(0, limit) : products;
      } else {
        throw new Error("File not found.");
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async getProductById(id) {
    try {
      if (this.#fileExists()) {
        const products = this.#readProducts();
        const product = products.find((p) => p.id === id);
        if (product) {
          return product;
        } else {
          throw new Error("Product not found.");
        }
      } else {
        throw new Error("File not found.");
      }
    } catch (e) {
      console.log(e.message);
    }
  }
}

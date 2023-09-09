import fs from "fs";

export class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
  }

  #fileExists() {
    return fs.existsSync(this.filePath);
  }

  #readCarts() {
    const carts = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(carts);
  }

  async #saveCarts(carts) {
    await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, "\t"));
  }

  async addCart() {
    const createID = (carts) => {
      const cartsLen = carts.length;
      if (cartsLen === 0) {
        return 1;
      } else {
        return carts[cartsLen - 1].id + 1;
      }
    };

    try {
      if (this.#fileExists()) {
        const carts = this.#readCarts();
        const cart = { id: createID(carts), products: [] };
        carts.push(cart);
        await this.#saveCarts(carts);
        this.carts = carts;
        console.log("Cart added!");
        return cart;
      } else {
        throw new Error("File not found.");
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async addProductToCart(cartId, productId, qty) {
    try {
      if (this.#fileExists()) {
        const carts = this.#readCarts();
        const cart = carts.find((c) => c.id === cartId);
        const productIdx = cart.products.findIndex((p) => p.id === productId);

        if (productIdx >= 0) {
          cart.products[productIdx].qty += qty;
        } else {
          cart.products.push({ id: productId, qty });
        }
        console.log("Product added to cart!");
        await this.#saveCarts(carts);
        return cart;
      } else {
        throw new Error("File not found.");
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async getCartById(id) {
    try {
      if (this.#fileExists()) {
        const carts = this.#readCarts();
        const cart = carts.find((c) => c.id === id);
        if (cart) {
          return cart;
        } else {
          throw new Error("Cart not found.");
        }
      } else {
        throw new Error("File not found.");
      }
    } catch (e) {
      console.log(e.message);
    }
  }
}

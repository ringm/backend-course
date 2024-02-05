import { Router } from "express";
import { cartExists } from "../middleware/cartExists.js";
import { productExists } from "../middleware/productExists.js";
import { productsExists } from "../middleware/productsExists.js";
import { cartService, ticketService } from "../services/index.js";
import { productService } from "../services/index.js";
import { isPremiumUser } from "../middleware/isPremiumUser.js";
import { asyncMiddleware } from "../middleware/async.js";
import { transport } from "../app.js";
import { formatMoney } from "../helpers/format.js";
import passport from "passport";

const router = Router();

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  asyncMiddleware(async (req, res) => {
    const cart = await cartService.get(req.params.id);
    res.status(200).send(cart);
  }),
);

router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  isPremiumUser,
  cartExists,
  productExists,
  asyncMiddleware(async (req, res) => {
    const product = {
      productId: req.params.pid,
      quantity: req.body?.quantity || 1,
    };
    await cartService.validateProduct(product);
    const cart = await cartService.addProduct(req.params.cid, product);
    res.status(200).json({ message: "Product added to cart", cart });
  }),
);

router.put(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  isPremiumUser,
  cartExists,
  productsExists,
  asyncMiddleware(async (req, res) => {
    await cartService.validateProducts(req.body.products);
    const products = req.body?.products || {};
    const cart = await cartService.update(req.params.cid, products);
    res.status(200).json({ message: "Cart Updated", cart });
  }),
);

router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  isPremiumUser,
  cartExists,
  asyncMiddleware(async (req, res) => {
    const cart = await cartService.get(req.params.cid);
    const ticketProducts = [];
    const outOfStock = [];

    for (const product of cart.products) {
      const p = await productService.getById(product._id);
      if (product.quantity <= p.stock) {
        const { _id, stock } = p;
        const newStock = stock - product.quantity;
        await productService.update(_id, { stock: newStock });
        ticketProducts.push({ ...product, stock: newStock });
      } else {
        outOfStock.push(product._id);
      }
    }

    if (ticketProducts.length > 0) {
      const amount = ticketProducts.reduce((acc, curr) => {
        return acc + curr.price * curr.quantity;
      }, 0);

      const updatedCart = cart.products
        .filter((product) => outOfStock.includes(product._id))
        .map((p) => {
          return { productId: p._id, quantity: p.quantity };
        });

      await cartService.update(cart._id, updatedCart);

      const ticket = await ticketService.create(req.user.email, amount);

      await transport.sendMail({
        from: 'Coder Ecommerce <ring.martin@gmail.com>',
        to: req.user.email,
        subject: 'Compra realizada con éxito',
        html: `
          <div>
            <h1>¡Gracias por comprar con nosotros!</h1>
            <p>Su compra se ha realizado con éxito, el código de su ticket es: <b>${ticket.code}</b></p>
            <p>Total: <b>$${formatMoney(ticket.amount)}</b></p>
          </div>
        `,
        attachments: []
      })

      res.status(200).json({
        message: "Purchase completed",
        ticket: ticket,
        ticketProducts: ticketProducts.map((p) => p._id),
        outOfStockProducts: outOfStock,
      });
    } else {
      res.status(400).json({ message: "Couldn't complete the order", products: cart.products });
    }
  }),
);

export { router as cartsRouter };

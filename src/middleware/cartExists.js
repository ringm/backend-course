import { cartService } from "../services/index.js";

export const cartExists = async (req, res, next) => {
  try {
    await cartService.get(req.params.cid);
    next();
  } catch (e) {
    res.status(404).json({ error: "Not found", details: e.message });
  }
};

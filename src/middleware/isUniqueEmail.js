import { userService } from "../services/index.js";

export const isUniqueEmail = async (req, res, next) => {
  try {
    await userService.find(req.body.email);
    res.status(400).json({ error: "Bad request", details: "Email is already registered." });
  } catch (e) {
    next();
  }
};

import { userService } from "../services/index.js";

export const userExists = async (req, res, next) => {
  const user = await userService.find(req.body.email);
  if (user) {
    throw new Error("Bad request: user already exists.");
  } else {
    next();
  }
};

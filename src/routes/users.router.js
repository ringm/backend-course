import { Router } from "express";
import { userService, cartService } from "../services/index.js";
import passport from "passport";
import { createHash } from "../utils.js";
import { asyncMiddleware } from "../middleware/async.js";
import { userExists } from "../middleware/userExists.js";

const router = new Router();

let port = process.env.PORT;
const isDEV = port == null || port == "" ? true : false;

if (isDEV) {
  port = 8080;
}

router.post(
  "/signup",
  userExists,
  asyncMiddleware(async (req, res) => {
    const { email, first_name, last_name, password, age, role } = req.body;
    const cart = await cartService.create({});
    const newUser = {
      first_name,
      last_name,
      age,
      email,
      cart: cart._id,
      password: createHash(password),
      role,
    };
    await userService.signUp(newUser);
    res.status(200).json({ status: "success", message: "User created successfully" });
  }),
);

router.post(
  "/login",
  asyncMiddleware(async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.logIn({ email, password });
    const token = userService.generateToken(user);
    res
      .status(200)
      .cookie(process.env.TOKEN_COOKIE_NAME, token, isDEV ? {} : { path: "/", domain: ".ringm.com.ar" })
      .json({ status: "success", message: "Log in successfull" });
  }),
);

router.get("/logout", (req, res) => {
  res.clearCookie(process.env.TOKEN_COOKIE_NAME, { httpOnly: true });
  res.send("logged out");
});

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send(req.user);
});

export { router as usersRouter };

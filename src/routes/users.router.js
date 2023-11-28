import { Router } from "express";
import { userService, cartService } from "../services/index.js";
import passport from "passport";
import { createHash } from "../utils.js";

const router = new Router();

let port = process.env.PORT;
const isDEV = port == null || port == "" ? true : false;

if (isDEV) {
  port = 8080;
}

router.post("/signup", async (req, res) => {
  const { email, first_name, last_name, password, age, role } = req.body;
  try {
    const user = await userService.find(email);
    if (user) {
      res.send(400).json({ status: "Bad request", message: "User already exists." });
    }
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
  } catch (e) {
    console.log(e);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.logIn({ email, password });
    if (user) {
      const token = userService.generateToken(user);
      res
        .status(200)
        .cookie(process.env.TOKEN_COOKIE_NAME, token, isDEV ? {} : { path: "/", domain: ".ringm.com.ar" })
        .json({ status: "success", message: "Log in successfull" });
    } else {
      res.status(401).json({ status: "Unauthorized", message: "Invalid credentials." });
    }
  } catch (e) {
    res.status(401).json({ status: "Unauthorized", message: "Invalid credentials." });
  }
});

router.get("/login-failed", async (req, res) => {
  res.status(401).json({ error: "Invalid credentials", error: "The provided username or password is incorrect." });
});

router.get("/logout", (req, res) => {
  res.clearCookie(process.env.TOKEN_COOKIE_NAME, { httpOnly: true });
  res.send("logged out");
});

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send(req.user);
});

export { router as usersRouter };

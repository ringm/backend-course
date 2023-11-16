import { Router } from "express";
import { userService } from "../services/index.js";
import passport from "passport";

const router = new Router();

let port = process.env.PORT;
const isDEV = port == null || port == "" ? true : false;

if (isDEV) {
  port = 8080;
}

router.post(
  "/signup",
  passport.authenticate("register", { failureRedirect: "/api/users/signup-failed" }),
  async (req, res) => {
    res.status(200).json({ status: "success", message: "User created successfully" });
  },
);

router.get("/signup-failed", async (req, res) => {
  res.status(409).send({ error: "Failed" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.logInUser({ email, password });
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

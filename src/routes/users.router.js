import { Router } from "express";
import { userService } from "../dao/index.js";
import passport from "passport";

const router = new Router();

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
        .cookie(process.env.TOKEN_COOKIE_NAME, token)
        // .cookie(process.env.TOKEN_COOKIE_NAME, token, { path: "/", domain: ".ringm.com.ar" })
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

// router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});

// router.get(
//   "/github-callback",
//   passport.authenticate("github", { failureRedirect: "/api/sessions/login" }),
//   async (req, res) => {
//     req.session.user = req.user;
//     res.status(200).redirect("https://coderhouse-ecommerce.ringm.com.ar");
//   },
// );

export { router as usersRouter };

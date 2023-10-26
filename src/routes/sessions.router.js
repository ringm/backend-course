import { Router } from "express";
import { userService } from "../dao/index.js";
import passport from "passport";

const router = new Router();

router.post("/signup", passport.authenticate("register", { failureRedirect: "/signup-failed" }), async (req, res) => {
  res.status(200).json({ status: "success", message: "User created successfully" });
});

router.get("/signupFailed", async (req, res) => {
  console.log("Sign Up Failed");
  res.send({ error: "Failed" });
});

router.post("/login", passport.authenticate("login", { failureRedirect: "/fail-login" }), async (req, res) => {
  if (!req.user) {
    res.status(400).json({ status: "error", error: "Invalid credentials." });
    req.session.user = {
      username: req.user.username,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    };
  }
  res.status(200).json({ status: "success", message: "Log in successfull", user: req.user });
});

router.get("/fail-login", async (req, res) => {
  res.send({ error: "Login failed" });
});

router.get("/logout", async (req, res) => {
  try {
    await req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Log out failed", details: "Couldn't log out user." });
      }
    });
    res.status(200).json({ session: false, user: undefined });
  } catch (e) {}
});

router.get("/check-session", async (req, res) => {
  try {
    if (req?.session?.passport) {
      const user = await userService.findUserById(req.session.passport.user);
      if (user) {
        res.status(200).json({ session: true, user });
      } else {
        res.status(200).json({ session: false, user: undefined });
      }
    } else {
      throw new Error("Session not found.");
    }
  } catch (e) {
    res.status(404).json({ session: false, details: e.message });
  }
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});

router.get("/github-callback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
  req.session.user = req.user;
  res.status(200).redirect("http://localhost:3000/");
});

export { router as sessionsRouter };

import { Router } from "express";
import { userService } from "../dao/index.js";

const router = new Router();

router.post("/signup", async (req, res) => {
  try {
    const newUser = await userService.signUpUser(req.body);
    if (newUser) {
      const { username, email } = newUser;
      res.status(200).json({ status: "success", message: "User created successfully", user: { username, email } });
    } else {
      throw new Error("Couldn't create user.");
    }
  } catch (e) {
    res.status(500).json({ message: "An error ocurred", details: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await userService.logInUser(req.body);
    if (user) {
      const { username, email, isAdmin } = user;
      req.session.email = user.email;
      req.session.isAdmin = user.isAdmin;
      res.status(200).json({ status: "success", message: "Log in successfull", user: { username, email, isAdmin } });
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (e) {
    res.status(404).json({ message: "Log in failed", details: e.message });
  }
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
    if (req?.session?.email) {
      const user = await userService.findUser(req.session.email);
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

export { router as sessionsRouter };

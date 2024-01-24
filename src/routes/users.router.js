import { Router } from "express";
import { userService, cartService } from "../services/index.js";
import passport from "passport";
import { createHash } from "../utils.js";
import { documentsUploader } from "../middleware/uploader.js";
import { asyncMiddleware } from "../middleware/async.js";
import { isUniqueEmail } from "../middleware/isUniqueEmail.js";

const router = new Router();

let port = process.env.PORT;
const isDEV = port == null || port == "" ? true : false;

if (isDEV) {
  port = 8080;
}

router.post(
  "/signup",
  isUniqueEmail,
  asyncMiddleware(async (req, res) => {
    await userService.validate(req.body);
    const { email, first_name, last_name, password, age, role } = req.body;
    const newUser = {
      first_name,
      last_name,
      age,
      email,
      cart: null,
      password: createHash(password),
      role,
    };
    if (role === "user") {
      const cart = await cartService.create({});
      newUser.cart = cart._id;
    }
    await userService.signUp(newUser);
    res.status(200).json({ status: "success", message: "User created successfully" });
  }),
);

router.post(
  "/login",
  asyncMiddleware(async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.logIn({ email, password });
    const lastConnection = new Date();
    user.last_connection = lastConnection;
    const updatedUser = await userService.update(user._id, user);
    const token = userService.generateToken(updatedUser);
    res
      .status(200)
      .cookie(process.env.TOKEN_COOKIE_NAME, token, isDEV ? {} : { path: "/", domain: ".ringm.com.ar" })
      .json({ status: "success", message: "Log in successfull" });
  }),
);

router.get("/logout", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const user = req.user;
  user.last_connection = new Date();
  await userService.update(user._id, user);
  res.clearCookie(process.env.TOKEN_COOKIE_NAME, { httpOnly: true });
  res.send("logged out");
});

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send(req.user);
});

router.post(
  '/:id/documents',
  passport.authenticate("jwt", { session: false }),
  documentsUploader.fields([
    {
      name: 'idFile',
      maxCount: 1
    },
    {
      name: 'addressFile',
      maxCount: 1
    },
    {
      name: 'bankFile',
      maxCount: 1
    },
  ]),
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const documents = Object.keys(req.files).map(key => req.files[key][0]);
    const docs = await userService.uploadDocuments(documents, req.params.id);
    const user = await userService.findById(id);
    if(docs.length === 3) {
      user.status = 'complete';
      user.role = 'premium';
    }
    if(docs.length > 0 && docs.length < 3) {
      user.status = 'incomplete';
    }
    user.documents = docs;
    await userService.update(id, user);
    const token = userService.generateToken(user);
    res
      .status(200)
      .cookie(process.env.TOKEN_COOKIE_NAME, token, isDEV ? {} : { path: "/", domain: ".ringm.com.ar" })
      .json({ status: "success", message: "Documents uploaded successfully" });
  }))

router.post(
  "/premium/:id",
  passport.authenticate("jwt", { session: false }),
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const user = await userService.findById(id);
    if (user.role !== "premium" && user.documents.length === 3) {
      user.role = "premium";
      await userService.update(id, user);
    }
    const token = userService.generateToken(user);
    res
      .status(200)
      .cookie(process.env.TOKEN_COOKIE_NAME, token, isDEV ? {} : { path: "/", domain: ".ringm.com.ar" })
      .json({ status: "success", message: "User updated successfully" });
  }));

export { router as usersRouter };

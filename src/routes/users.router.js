import { Router } from "express";
import { userService, cartService } from "../services/index.js";
import passport from "passport";
import { createHash } from "../utils.js";
import { documentsUploader } from "../middleware/uploader.js";
import { asyncMiddleware } from "../middleware/async.js";
import { isUniqueEmail } from "../middleware/isUniqueEmail.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = new Router();

let port = process.env.PORT;
const isDEV = port == null || port == "" ? true : false;

if (isDEV) {
  port = 8080;
}

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  asyncMiddleware(async (req, res) => {
    const users = await userService.get();
    res.status(200).json(users);
  })
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  asyncMiddleware(async (req, res) => {
    const user = await userService.findById(req.params.id);
    res.status(200).json(user);
  })
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  asyncMiddleware(async (req, res) => {
    const updatedUser = await userService.update(
      req.params.id,
      req.body
    );
    res.status(200).json({ message: "User updated", user: updatedUser });
  })
);

router.delete(
  '/',
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  asyncMiddleware(async (req, res) => {
    const deletedUsers = await userService.deleteInactive();
    res.status(200).json({ message: "Users deleted", deletedUsers: deletedUsers });
  })
)

router.delete(
  '/:id',
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  asyncMiddleware(async (req, res) => {
    const deletedUser = await userService.delete(
      req.params.id
    );
    res.status(200).json({ message: "User deleted", user: deletedUser });
  })
);

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
      last_connection: new Date(),
      password: createHash(password),
      role: role || 'user',
    };
    if (newUser.role === "user") {
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

router.get("/current/me", passport.authenticate("jwt", { session: false }), asyncMiddleware(async (req, res) => {
  const u = await userService.findById(req.user._id);
  const user = {
    _id: u._id,
    first_name: u.first_name,
    last_name: u.last_name,
    email: u.email,
    age: u.age,
    role: u.role,
    status: u.status,
    cart: u.cart,
    documents: u.documents,
  }
  res.send(user);
}));

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

    if (documents.length === 0) {
      res.status(400).send({ message: 'No files were uploaded' });
      return;
    }

    const newDocs = await userService.uploadDocuments(documents, req.params.id);
    const user = await userService.findById(id);

    if (user.documents.length === 0) {
      user.documents = newDocs;
    } else {
      const oldDocs = user.documents.filter(doc => !newDocs.find(d => d.name === doc.name));
      user.documents = [...oldDocs, ...newDocs];
    }

    if (user.documents.length === 3) {
      user.status = 'complete';
      user.role = 'premium';
    }
    if (user.documents.length > 0 && user.documents.length < 3) {
      user.status = 'incomplete';
    }

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

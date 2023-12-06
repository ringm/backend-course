import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  constructor() {
    this.model = userModel;
    this.validatePassword = (user, password) => bcrypt.compareSync(password, user.password);
  }

  async find(email) {
    try {
      const user = await this.model.findOne({ email: email });
      if (!user) {
        throw new Error("User not found.");
      }
      return user;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async findById(id) {
    try {
      const user = await this.model.findById(id);
      if (user) {
        return user;
      } else {
        throw new Error("User not found.");
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async signUp(user) {
    try {
      const res = await this.model.create(user);
      return res;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async logIn(user) {
    try {
      const dbUser = await this.model.findOne({ email: user.email });
      if (!dbUser) {
        throw new Error("User not found.");
      }

      if (this.validatePassword(dbUser, user.password)) {
        return dbUser;
      } else {
        throw new Error("Bad request: invalid credentials.");
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  generateToken(user) {
    const token = jwt.sign(
      {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        cart: user.cart,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    return token;
  }
}

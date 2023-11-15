import { userModel } from "../models/user.model.js";
import { isValidPassword } from "../utils.js";
import jwt from "jsonwebtoken";

export class UserManagerMongo {
  constructor() {
    this.model = userModel;
  }

  async findUser(email) {
    try {
      const user = await this.model.findOne({ email });
      if (user) {
        return user;
      } else {
        throw new Error("User not found.");
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async findUserById(id) {
    try {
      const user = await this.model.findById(id);
      if (user) {
        return user;
      } else {
        throw new Error("User not found.");
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async signUpUser(user) {
    try {
      const res = await this.model.create(user);
      return res;
    } catch (e) {
      throw new Error("Couldn't create user.");
    }
  }

  async logInUser(user) {
    try {
      const dbUser = await this.model.findOne({ email: user.email });
      if (!dbUser) {
        throw new Error("User not found.");
      }

      if (isValidPassword(dbUser, user.password)) {
        return dbUser;
      } else {
        throw new Error("Invalid password.");
      }
    } catch (e) {
      console.log(e.message);
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

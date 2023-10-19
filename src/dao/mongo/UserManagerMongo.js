import { userModel } from "./models/user.model.js";

export class UserManagerMongo {
  constructor() {
    this.model = userModel;
  }

  async findUser(email) {
    try {
      const user = await this.model.findOne({ email });
      if (user) {
        const { username, email } = user;
        return { username, email };
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

      if (dbUser.password !== user.password) {
        throw new Error("Invalid password.");
      } else {
        return dbUser;
      }
    } catch (e) {
      console.log(e.message);
    }
  }
}

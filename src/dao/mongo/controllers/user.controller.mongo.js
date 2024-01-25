import { userModel } from "../models/user.model.js";
import { userJoiSchema } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
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
        throw new Error("Bad request: invalid credentials.");
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

  async validate(user) {
    const { error } = await userJoiSchema.validateAsync(user, { abortEarly: false });
    if (error) {
      throw new Error(`Bad request: ${error.details.map((e) => e.message)}`);
    }
  }

  async update(id, user) {
    try {
      const result = await this.model.findByIdAndUpdate(id, user, { new: true });
      if (!result) {
        throw new Error("User not found.");
      }
      return result;
    } catch (e) {
      throw new Error("Couldn't update user.");
    }
  }

  async uploadDocuments(documents, id) {
    const docs = await Promise.all(
      documents.map((file) => {
        return new Promise((res, rej) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'raw', public_id: file.fieldname, folder: `documents/${id}`, overwrite: true }, (error, result) => {
              if (error) {
                console.error('Error uploading to Cloudinary:', error);
                rej('Upload failed');
              } else {
                res({name: file.fieldname, reference: result?.secure_url});
              }
            }).end(file.buffer);
        })
      }))
    return docs;
  }

  generateToken(user) {
    const token = jwt.sign(
      {
        _id: user._id,
        first_name: user.first_name,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    return token;
  }
}

import { __dirname } from "../utils.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (feq, file, cb) {
    cb(null, __dirname + "/public/img");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploader = multer({ storage });

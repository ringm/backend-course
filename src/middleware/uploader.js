import multer from "multer";

export const uploader = multer({
  dest: "images/",
});

import multer from "multer";

export const imagesUploader = multer({
  storage: multer.memoryStorage(),
});

export const documentsUploader = multer({
  storage: multer.memoryStorage(),
});

import { prodLogger, devLogger } from "../helpers/logger.js";

export const error = (err, req, res, next) => {
  const message = err.message.toLowerCase();
  const env = process.env.NODE_ENV || "development";
  switch (true) {
    case message.includes("bad request"):
    case message.includes("required"):
    case message.includes("must"):
      res.status(400);
      break;
    case message.includes("unauthorized"):
      res.status(401);
      break;
    case message.includes("forbidden"):
      res.status(403);
      break;
    case message.includes("not found"):
      res.status(404);
      break;
    default:
      res.status(500);
  }
  if (env === "development") {
    devLogger.error(err.message);
  } else {
    prodLogger.error(err.message);
  }
  res.send(err.message);
};

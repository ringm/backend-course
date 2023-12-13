import { Router } from "express";
import { devLogger, prodLogger } from "../helpers/logger.js";

const router = Router();

router.get("/loggerTest", (req, res) => {
  const env = process.env.NODE_ENV || "development";
  if (env === "development") {
    console.log("dev");
    devLogger.error("This is an error message.");
    devLogger.warn("This is a warning message.");
    devLogger.info("This is an information message.");
    devLogger.debug("This is a debug message.");
  } else {
    console.log("prod");
    prodLogger.error("This is an error message.");
    prodLogger.warn("This is a warning message.");
    prodLogger.info("This is an information message.");
    prodLogger.debug("This is a debug message.");
  }

  return res.status(200).json({ message: "Logger test complete." });
});

export { router as loggerRouter };

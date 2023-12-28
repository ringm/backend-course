import { Router } from "express";
import { asyncMiddleware } from "../middleware/async.js";

const router = Router();

router.get('/', asyncMiddleware(async (req, res) => {
  console.log('mail router')
}))

export { router as mailRouter };
import { Router } from "express";
import { asyncMiddleware } from "../middleware/async.js";
import nodemailer from 'nodemailer';

const router = Router();

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'ring.martin@gmail.com',
    pass: 'xsor gsga ofdr hqxu'
  }
})

router.get('/', asyncMiddleware(async (req, res) => {
  let result = await transport.sendMail({
    from: 'Coder Ecommerce <ring.martin@gmail.com>',
    to: 'ring.martin@gmail.com',
    subject: 'Password Reset',
    html: `
      <div>
        <h1>Reset your password</h1>
      </div>
    `,
    attachments: []
  })
}))

export { router as mailRouter };
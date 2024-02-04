import { Router } from "express";
import { asyncMiddleware } from "../middleware/async.js";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

const router = Router();

dotenv.config();

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
})

router.get('/password-reset', asyncMiddleware(async (req, res) => {
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
  res.status(200).json({ message: 'Email sent' })
}))

router.get('/:id/account-deleted', asyncMiddleware(async (req, res) => {
  let result = await transport.sendMail({
    from: 'Coder Ecommerce <ring.martin@gmail.com>',
    to: 'ring.martin@gmail.com',
    subject: 'Account deleted',
    html: `
      <div>
        <h1>Reset your password</h1>
      </div>
    `,
    attachments: []
  })
  res.status(200).json({ message: 'Email sent' })
}))

export { router as mailRouter };
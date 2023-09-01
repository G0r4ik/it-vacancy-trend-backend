import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export const sendMail = object =>
  transporter.sendMail({ ...object, to: process.env.EMAIL_TO_SEND_TO })

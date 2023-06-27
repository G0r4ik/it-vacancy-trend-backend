import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'eforfora@gmail.com',
    pass: 'kktcbstomhtstfjz',
  },
})

export const sendMail = object =>
  transporter.sendMail({ ...object, to: process.env.EMAIL_TO_SEND_TO })

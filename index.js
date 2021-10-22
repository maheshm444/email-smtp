const express = require('express')
const app = express()
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()
app.use(express.json())

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_DRALKAS,
    pass: process.env.PASSWORD,
  },
})
app.post('/', async (req, res) => {
  const links = req.body.links ? req.body.links : ''
  await transporter
    .sendMail({
      from: req.body.from,
      to: req.body.to,
      subject: `Email from Dr. Alkas Team ${req.body.subject}`,
      text: `${req.body.message} \n Links to the documents: ${links} \n\n\n Regards\n Dr.Alkas Team`,
    })
    .then(console.log('Email sent successfully'))
    .catch((e) => console.log(`Error received ${e}`))
  console.log(req.body)
  res.json({ status: 200, message: 'Email sent successfully' })
})

app.listen('5000', () => console.log('listening on post 5000'))

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
  const user = req.body.user ? req.body.user : 'User'
  const toEmail = req.body.userEmail ? req.body.userEmail : ''
  const type = req.body.type ? req.body.type : ''
  const doctor = req.body.DoctorName ? req.body.DoctorName : ''
  const appointmentTime = req.body.AppointTime ? req.body.AppointTime : ''
  const consultationType =
    req.body.consultationType === 'online'
      ? 'Online(https://meet.faanoos.org/) Please join the link on the exactly on the specified time'
      : 'Physical'
  const mediaLinks = []
  req.body.links &&
    req.body.links.length > 0 &&
    req.body.links.map((link) => mediaLinks.push(link))

  console.log('mediaLinks', mediaLinks)

  await transporter
    .sendMail({
      from: 'dralkas.backend@gmail.com',
      to: toEmail,
      subject: `Email from Dr. Alkas Team - ${type}`,
      text: `Dear ${user},

      Greetings from Dr.Alkas Team, Your ${type} has been booked with our Clinic.

      Appointment Details:
      Doctor Name: ${doctor}
      Appointment Date and Time: ${appointmentTime}
      Consultation Type: ${consultationType}
      Other documents submitted by the patient: ${mediaLinks.map(
        (media) => media + ' '
      )}
      
      Regards
      Dr.Alkas Team`,
    })
    .then(console.log('Email sent'))
    .catch((e) => res.json({ status: 400, message: 'Error ocurred' }))
  res.json({ status: 200, message: 'Email sent successfully' })
})

app.listen('5000', () => console.log('listening on port 5000'))

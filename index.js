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

app.get('/', async (req, res) => {

  res.send({code: 200, "message":"Connected successfully"})
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

app.post('/order-medicine', async (req, res) => {

const {address, user, userEmail, type, medicines, links } = req.body

  const mediaLinks = []
  links &&
    links.length > 0 &&
    links.map((link) => mediaLinks.push(link))

  console.log('mediaLinks', mediaLinks)

  await transporter
    .sendMail({
      from: 'dralkas.backend@gmail.com',
      to: userEmail,
      subject: `Email from Dr. Alkas Team - ${type}`,
      text: `Dear ${user != '' ? user : 'User'},

      Greetings from Dr.Alkas Team, Your ${type} has been booked with our Clinic.

      Booking Details:
      Medicines Booked: 
      ${medicines.map(medicine => 
      `
        Medicine Name: ${medicine.name}
        Cost: ${medicine.price}
        Quantity: ${medicine.quantity}
        Expiry: ${(medicine.expiry!= '' && medicine.expiry!= undefined ) ? medicine.expiry : "Not Applicable"}
        `
        )
      }
      Shipto Address: ${address}
      Prescriptions Submitted by the patient: ${mediaLinks.map(
        (media) => media + ' '
      )}
      
      Regards
      Dr.Alkas Team`,
    })
    .then(console.log('Email sent'))
    .catch((e) => res.json({ status: 400, message: 'Error ocurred' }))
  res.json({ status: 200, message: 'Medicine orders email sent successfully' })
})

app.post('/order-products', async (req, res) => {

  const {address, user, userEmail, type, products } = req.body
  
    await transporter
      .sendMail({
        from: 'dralkas.backend@gmail.com',
        to: userEmail,
        subject: `Email from Dr. Alkas Team - ${type}`,
        text: `Dear ${user != '' ? user : 'User'},
  
        Greetings from Dr.Alkas Team, Your ${type} has been booked with our Clinic.
  
        Booking Details:
        Products Booked: 
        ${products.map(product => 
        `
          Product Name: ${product.name}
          Cost: ${product.price}
          Quantity: ${product.quantity}
          Expiry: ${(product.expiry!= '' && product.expiry!= undefined ) ? product.expiry : "Not Applicable"}
          `
          )
        }
        Shipto Address: ${address}
        
        Regards
        Dr.Alkas Team`,
      })
      .then(console.log('Email sent'))
      .catch((e) => res.json({ status: 400, message: 'Error ocurred' }))
    res.json({ status: 200, message: 'Product orders email sent successfully' })
  })


app.listen('3000', () => console.log('listening on port 3000'))

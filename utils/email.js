const nodemailer = require('nodemailer');
const { options } = require('../routes/userRoutes');

const sendEmail = options =>{
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // 2) Definde the email options
    const mailOtions = {
        from: 'Ariana Academy <Info@ariana.academy>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: ,
    }


    // 3) Actually send the email

    
}
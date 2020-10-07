const nodemailer = require('nodemailer');


const sendEmail = async options =>{
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // host: "smtp.mailtrap.io",
        // port: 2525,
        // auth: {
        //     user: "bc12d7af1fcc15",
        //     pass: "89d59d36271b6e"
        //  }
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
    await transporter.sendMail(mailOtions)

}

module.exports = sendEmail;
const sgMail = require('@sendgrid/mail')
const e = require('express')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)



const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from: 'serg1deev@gmail.com',
        to: email,
        subject: 'Welcome to my app!',
        text: `Welcome to my app, ${name}! Let me now how you get along with the app`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        from: 'serg1deev@gmail.com',
        to: email,
        subject: 'Sorry to see you go',
        text: `Goodbye dear ${name}! Hope to see you back`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
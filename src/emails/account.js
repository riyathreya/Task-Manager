const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(email, name){
    sgMail.send({
        to: 'riyathreya@gmail.com',
        from: 'riyathreya@gmail.com',
        subject: 'Sending Welcome Mail',
        text: `Welcome to Task-Manager App, ${name}`
    })
}

function sendGoodbyeEmail( email, name) {
    sgMail.send({
        to: 'riyathreya@gmail.com',
        from: 'riyathreya@gmail.com',
        subject: 'Goodbye Mail',
        text: `Can i know what went wrong, ${name}`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}
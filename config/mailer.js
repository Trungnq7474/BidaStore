
require('dotenv').config();

const nodemailer = require('nodemailer');

let transporter;

if (process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    transporter = {
        sendMail: async (mail) => {
            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL,
                to: mail.to,
                subject: mail.subject,
                text: mail.text
            });

            if (error) throw new Error(error.message);

            return data;
        }
    };
} else {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

module.exports = transporter;
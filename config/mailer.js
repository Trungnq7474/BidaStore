
require('dotenv').config();

const nodemailer = require('nodemailer');

let transporter;

if (
    process.env.GMAIL_CLIENT_ID &&
    process.env.GMAIL_CLIENT_SECRET &&
    process.env.GMAIL_REFRESH_TOKEN
) {
    const { google } = require('googleapis');

    const oauth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    transporter = {
        sendMail: async (mail) => {
            const gmail = google.gmail({
                version: 'v1',
                auth: oauth2Client
            });

            const from = mail.from || process.env.EMAIL_USER;

            const message = [
                `From: ${from}`,
                `To: ${mail.to}`,
                `Subject: ${mail.subject}`,
                'MIME-Version: 1.0',
                'Content-Type: text/plain; charset="UTF-8"',
                'Content-Transfer-Encoding: base64',
                '',
                Buffer.from(mail.text || '', 'utf-8').toString('base64')
            ].join('\r\n');

            const encodedMessage = Buffer
                .from(message, 'utf-8')
                .toString('base64url');

            const result = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage
                }
            });

            return result.data;
        }
    };
} else if (process.env.RESEND_API_KEY) {
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
import nodemailer from 'nodemailer';
import 'dotenv/config';

const { GMAIL_USER, GMAIL_PASSWORD } = process.env;

const nodemailerConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASSWORD,
    },
};

const transport = nodemailer.createTransport(nodemailerConfig);


const sendEmail = (data) => {
    const email = { ...data, from: GMAIL_USER };
    return transport.sendMail(email)
}

export default sendEmail;
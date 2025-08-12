import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',  
  port: 465,
  secure: true, 
  auth: {
    user: 'upsplit@aryan-sharma.xyz',
    pass: process.env.EMAIL_SMTP_PASS, 
  },
});

export default transporter;
// transporter.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',  
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: 'upsplit@aryan-sharma.xyz',
    pass: process.env.EMAIL_SMTP_PASS, 
  },
});

export default transporter;
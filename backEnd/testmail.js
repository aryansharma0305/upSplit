import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: 'smtp.zoho.com',  // or smtp.zoho.com for global domains
//   port: 465,
//   secure: true, // true for port 465, false for 587
//   auth: {
//     user: 'aryan@aryan-sharma.xyz',
//     pass: 'TGYYJzhxrF2q',
//   },
// });


// const transporter = nodemailer.createTransport({
//   host: 'smtp.zoho.com',  // or smtp.zoho.com for global domains
//   port: 465,
//   secure: true, // true for port 465, false for 587
//   auth: {
//     user: 'support@aryan-sharma.xyz',
//     pass: 'y9Ritc6tK3Eu',
//   },
// });





const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',  // or smtp.zoho.com for global domains
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: 'upsplit@aryan-sharma.xyz',
    pass: '0mtHgxv1muwH',
  },
});



const mailOptions = {
  from: 'upsplit@aryan-sharma.xyz',
  to: 'aryansharma0305@gmail.com',
  subject: 'Zoho Mail Test',
  text: 'OTP: 938499',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('❌ Error:', error);
  }
  console.log('📤 Email sent:', info.response);
});

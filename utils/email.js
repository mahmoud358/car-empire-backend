const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.Email_User, 
        pass: process.env.Email_Password, 
      },
    });
  
    const emailOptions = {
      from: 'Car Empire<fekry.zakaria1461998@gmail.com>', 
      to: options.email,
      subject: options.subject,
      html: options.html,
    };
  
    await transporter.sendMail(emailOptions);
  };
  module.exports = sendEmail;
 

const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class sendEmail{
  constructor(user, url){
    this.to = user.email;
    this.firstName = user.name.split('')[0];
    this.url = url;
    this.from = `Kounselo Edcuational Services<${process.env.EMAIL_FROM}>`
  }
  newTransport(){
   nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
// send actual mail
  async send(template, subject) {
    // 1)Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName : this.firstName,
      url : this.url,
      subject
    });

    // 2)Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      html,
      text: htmlToText.fromString(html)
      // html:
    };

    // 3)Create a transport and send the actual mail
    await this.newTransport.sendMail(mailOptions);  
  }
  
  async sendWelcome(){
    await this.send('Welcome', 'Welcome to the Kounselo Educational Services')
  }
}



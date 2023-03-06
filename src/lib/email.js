const nodemailer = require( 'nodemailer')
const config = require( '#config')

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport

async function sendMail(options ){
  const transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
      user: config.email.username,
      pass: config.email.password,
    },
    secure: false, 
  })

  const mailOptions = {
    from: config.email.from ,
    to: options.to ,
    subject: options.subject,
    html: options.html 
  }

  transporter.sendMail(mailOptions , (err, info)=>{
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  })
  
}



exports.verifyConnection = () => Promise.resolve(true)

module.exports = sendMail

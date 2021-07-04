const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const {
      EMAIL_SERVICE_HOST,
      EMAIL_SERVICE_PORT,
      EMAIL_SERVICE_USER,
      EMAIL_SERVICE_PASSWORD,
    } = process.env;
    var { to, subject, body } = options;
    //create transport
    var transport = nodemailer.createTransport({
      host: EMAIL_SERVICE_HOST,
      port: EMAIL_SERVICE_PORT,
      auth: {
        user: EMAIL_SERVICE_USER,
        pass: EMAIL_SERVICE_PASSWORD,
      },
    });
    //define email options
    var mailOptions = {
      from: "sketchlada@service.com",
      to,
      subject,
      text: body,
    };
    //send email
    await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;

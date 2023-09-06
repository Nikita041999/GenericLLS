const nodemailer = require("nodemailer");
class EmailSender {
  /***
   * @summary: This function is use for setup the email Transporter
   *
   */
  setupTransporter() {
    // dotenv.config();
    this.emailFrom = process.env.EMAIL_FROM;
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, //
        pass: process.env.EMAIL_PASS, //
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  /***
   * @summary: This function is use for send email to any users
   * @param: to
   * @param: sub
   * @param: msg
   */
  async sendEmail(to, sub, msg) {
    console.log("email sender send email fn");
    console.log("to =", to);
    console.log("sub =", sub);
    console.log("msg =", msg);
    try {
      this.setupTransporter();
      console.log("send transmail done");
      const mailOptions = {
        from: this.emailFrom, // sender address
        to: to, // list of receivers
        subject: sub, // Subject line
        // text: "Hello world?", // plain text body
        html: msg, // html body
      };
      
     return new Promise((resolve, reject) => {
        this.transporter.sendMail(mailOptions, function (err) {
          if (err) {
            console.log("this.transporter.sendMail.error", err);
            reject(err);
          } else {
            resolve(true);
            console.log("Message sent!");
          }
        });

      });

      // Promise.all([myPromise]).then((values) => {
      //   console.log(values);
      //   console.log("this.transporter =", this.transporter);
      //   console.log("send mail done");
      //   //resolve(values);
      // });
      // expected output: Array [3, 42, "foo"]

      
     
      
    } catch (sendMailErr) {
      console.log("sendMailCatchErr = ", sendMailErr);
    }
  }
}

module.exports = EmailSender;

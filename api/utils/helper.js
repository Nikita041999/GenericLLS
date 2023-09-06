import CryptoJS from "crypto-js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

export function to(promise) {
  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => [err]);
}

export function passwordEncryption(password) {
  return CryptoJS.SHA512(password, process.env.EncryptionKEY).toString();
}
export function generateUniqueToken() {
  const randomString = Math.random().toString(24).substring(2);
  return CryptoJS.SHA512(randomString, process.env.EncryptionKEY).toString();
}

// Create a transporter using the default SMTP transport
export const transporter = nodemailer.createTransport({
  host: "mail.24livehost.com",// process.env.EMAIL_HOST,
  port: 587, //Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: "ds20@24livehost.com",// process.env.EMAIL_USER, //
    pass: "Dsmtp@909#" //process.env.EMAIL_PASS, //
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const mailDetails = {
  from: `${process.env.EMAIL_FROM}`, //-------- sender email
  to: "nikitiw0406@gmail.com", //-------- receiver email
  subject: "Test mail", //-------- subject do you want
  test: "Node.js testing mail for SIT",
  html: "<b>Hello world?</b> <i>Tanuj Sahu Here<i>",
};

export const sendMail = (link) => {
  // dotenv.config()
  const {resetLink,email} = link
  // console.log("resetLink,email",resetLink,email);
  const mailOptions = {
    from: "ds20@24livehost.com", //process.env.EMAIL_USER,
    to: `${email}`,
    // to: 'nikita0101@yopmail.com',
    subject: 'Update Password',
    html: `
    <p>Hello,</p>
    <p>You requested to reset your password. Click the link below to reset it:</p>
    <a href="${resetLink}">${resetLink}</a>
  `,
  };
  // console.log("mailOptions **", mailOptions);
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        console.log("this.transporter.sendMail.error", err);
        reject(err);
      } else {
        resolve(true);
        console.log("Message sent!");
      }
    });
  });
};


export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

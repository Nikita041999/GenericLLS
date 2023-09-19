import CryptoJS from "crypto-js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fetch from "node-fetch";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

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

export function wordCorrection(str) {
  str = str.trim().toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Create a transporter using the default SMTP transport
export const transporter = nodemailer.createTransport({
  host: "mail.24livehost.com", // process.env.EMAIL_HOST,
  port: 587, //Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: "ds20@24livehost.com", // process.env.EMAIL_USER, //
    pass: "Dsmtp@909#", //process.env.EMAIL_PASS, //
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
  const { resetLink, email } = link;
  // console.log("resetLink,email",resetLink,email);
  const mailOptions = {
    from: "ds20@24livehost.com", //process.env.EMAIL_USER,
    to: `${email}`,
    // to: 'nikita0101@yopmail.com',
    subject: "Update Password",
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

export function downloadURLImage(imageUrl) {
  // const imageUrl = "https://avatars.githubusercontent.com/u/108452468?v=4";
  const now = new Date();
  let imgCode = imageUrl.split("/");
  imgCode = imgCode[imgCode.length - 1];
  console.log("0", imgCode);

  // Define the destination directory and filename for the downloaded image
  const destinationDir = "downloads";
  const filename = `github_image.jpg`; // You can change the filename as needed

  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir)
  }
  // Function to download the image
  async function downloadImage() {
    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        console.log("res not okay");
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }
      // Get the image data as a Buffer
      // const imageData = await response.buffer();
      const arrayBuffer = await response.arrayBuffer();
      // Convert the ArrayBuffer to a Buffer
      const imageData = Buffer.from(arrayBuffer);
    
      const imagePath = path.join(destinationDir, filename);
    fs.writeFileSync(imagePath, imageData);
      // fs.writeFileSync(imagePath, imageData);
      
      console.log("Image downloaded successfully.");
    } catch (error) {
      console.error("Error downloading image:", error.message);
    }
  }
  downloadImage();
}

export function imageStorage() {
  // Configuration for Multer storage
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log("file----->", file);
      cb(null, "Images");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      console.log("file name:", file);
      console.log(path.extname(file.originalname));
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });
  const upload = multer({ storage: multerStorage });
  upload.single();
}

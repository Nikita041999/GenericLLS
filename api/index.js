import express from "express";
import dotenv from "dotenv";
import router from "./routes/user/user.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// expressMailer.extend(app, {
//   from: `${process.env.EMAIL_FROM}`,
//   host: `${process.env.EMAIL_HOST}`, // Your SMTP server host
//   secureConnection: false, // Use SSL
//   port: 587, // Port for secure SMTP
//   transportMethod: "SMTP",
//   auth: {
//     user: `${process.env.EMAIL_USER}`,
//     pass: `${process.env.EMAIL_PASS}`,
//   }
// });


app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
//-------------- jwt Middleware -------------------

// Use the login and logout routes
app.use('/api',router);
// app.get('/',(req,res) => {
//   return res.send({mesage:"Get api successfully called."})
// })


const startServer = async () => {
  try {
    app.listen(port);
    console.log(`Server is listening on port ${port}`);
  } catch (error) {
    console.error(`Error starting the server: ${error}`);
  }
};

// const teamId = 'IUtYpnYhSLZxFCMBTNGT4gJ8'
// const result = await fetch(
//   'https://api.vercel.com/v6/deployments',
//   {
//       method: 'GET',
//       headers: {
//           Authorization: `Bearer ${teamId}`,
//       }
//   }
// );
// result()
// export default app;
startServer();

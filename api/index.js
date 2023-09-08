import express from "express";
import dotenv from "dotenv";
import router from "./routes/user/user.js";
dotenv.config();
const app = express();
// const port = process.env.PORT || 3000;
const port = process.env.PORT || 4000;


app.use(express.json());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });
//-------------- jwt Middleware -------------------

// Use the login and logout routes
app.get('/',(req,res) => {
  return res.send({mesage:"Get updated api successfully called."})
})
app.use('/api',router);



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

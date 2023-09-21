import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user/user.js";
// import adminRoutes from "./routes/admin/admin.js"
import cors from 'cors'
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;


app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:3000',
//   allowedHeaders: ['authorization'],
// }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
//-------------- jwt Middleware -------------------

// Use the login and logout routes
// app.use('/admin',adminRoutes);
app.use('/',userRoutes);

//getUserData
//access token is going to be passed in as an aunthorization header


const startServer = async () => {
  try {
    app.listen(port);
    console.log(`Server is listening on port ${port}`);
  } catch (error) {
    console.error(`Error starting the server: ${error}`);
  }
};

startServer();

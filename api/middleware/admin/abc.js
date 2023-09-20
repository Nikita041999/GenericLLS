import { getConnection } from "../../db/index.js";

import CryptoJS from "crypto-js";
import { generateJWT } from "../../utils/jwt.js";

export const login = async () => {
  console.log('11111');
  let { email, password } = req.body;
  console.log("=====>",password);
  password = CryptoJS.SHA512(password, process.env.EncryptionKEY).toString();
  // console.log("newPassword**********", email, password);
  if ((email, password)) {
    // console.log(email, password);
    const query = `select * from employees where email_address=? and password=?`;

    const con = await getConnection();

    con.connect((err) => {
      if (err) {
        console.log("Error!::)", err);
        throw err;
      } else {
        console.log("Db connected!");
      }
    });

    con
      .query(query, [email, password])
      .then(
        (data) => {
          if (data[0].length >= 1) {
            const token = generateJWT(email);
            res.status(200).send({
              data: data[0],
              token,
              message: "Admin login successfully.",
              status: true,
            });
          } else {
            res.status(401).send({
              data: [],
              message: "User not found.",
              status: false,
            });
          }
        },
        (error) => {
          res.send({
            data: [],
            message: "The Email address or Password you entered doesn't match.",
            status: false,
            error: error,
          });
        }
      )
      .catch((err) => {
        res.send({
          data: [],
          message: "Some error occur:",
          status: false,
          error: err,
        });
      }).then( () => con.end());

      
  } else {
    res.send({
      data: [],
      message: "EmailId or password is required",
      status: false,
    });
  }
}
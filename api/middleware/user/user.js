import { getConnection } from "../../db/index.js";
import { generateJWT, verifyJWT } from "../../utils/jwt.js";
import {
  transporter,
  sendMail,
  wordCorrection,
  passwordEncryption,
  generateUniqueToken,
} from "../../utils/helper.js";

export const loginRoute = async (req, res) => {
  console.log('req.body---------->',req.body);
  let { email, password } = req.body;
  email = email.trim().toLowerCase();
  let con = await getConnection();
  const enc_pswrd = passwordEncryption(password);
  if (email && password) {
    const query = `select * from players where email_address=? and password=?`;
    con
      .query(query, [email, enc_pswrd])
      .then(
        (data) => {
          if (data[0].length >= 1) {
            const token = generateJWT(data[0][0].id);
            res.status(200).send({
              data: data[0],
              token,
              message: "login successfully",
              status: true,
            });
          } else {
            res.status(200).send({
              data: data[0],
              message: "Email or Password do not exist.",
              status: false,
            });
          }
        },
        (error) => {
          res.send({
            data: [],
            message: "Email or Password did not match",
            status: false,
            error: error,
          });
        }
      )
      .catch((err) => {
        res.send({
          data: [],
          message: "Email or Password did not match",
          status: false,
          error: err,
        });
      });
  } else {
    res.send({
      data: [],
      message: "Email and password is required",
      status: false,
    });
  }
};

export const sigupRoute = async (req, res) => {
  let con = await getConnection();
  let {
    firstname,
    lastname,
    email,
    password,
    institute,
    city,
    country,
    correct_answers,
    questions_attempted,
    start_time,
    end_time,
    total_time,
  } = req.body;
  firstname = wordCorrection(firstname)
    lastname= wordCorrection(lastname)
    email = email.trim().toLowerCase()
    institute = wordCorrection(institute)
    city = wordCorrection(city)
    country = wordCorrection(country)
  const existingUser = await con.query(
    "SELECT * FROM players WHERE email_address = ?",
    [email]
  );
  if (existingUser[0].length > 0) {
    return res.send({ data: [], message: "Email already exists." });
  } else {
    const enc_pswrd = passwordEncryption(password);

    const insertUser = `INSERT INTO players (
    firstname,
    lastname,
    email_address,
    password,
    institute,
    city,
    country
) VALUES (?,?,?,?,?,?,?)`;
    con
      .query(insertUser, [
        firstname,
        lastname,
        email,
        enc_pswrd,
        institute,
        city,
        country,
      ])
      .then(async (data) => {
        const insertedData = await con.query(
          "SELECT * FROM players WHERE email_address = ?",
          [email]
        );
        const token = generateJWT(insertedData[0][0].id);
        res.send({
          data: insertedData[0],
          token,
          message: "Player registered.",
          status: true,
        });
      })
      .catch((err) => {
        res.send({
          data: [],
          err: err,
          message: "Could not register the player.",
          status: false,
        });
      });
  }
};

export const forgetPasswordMail = async (req, res) => {
  const uniqueToken = generateUniqueToken();
  let con = await getConnection();
  let { email } = req.body;
  email = email.trim().toLowerCase()
  const resetLink = `${process.env.SITE_URL}/change-password?token=${uniqueToken}`;
  // mail id exists
  const mailExist = `select * from players where email_address=?`;
  con.query(mailExist, [email]).then((data) => {
    if (data[0].length >= 1) {
      // if maild id exisits reset_token set
      const sql = "UPDATE players SET reset_token = ? WHERE id = ?";
      con
        .query(sql, [uniqueToken, data[0][0].id])
        .then((data) => {
          sendMail({ resetLink, email });
          return res.send({
            message: "Mail to reset the password has been sent to your mail Id.",
            status: true,
          });
        })
        .catch((err) => {
          return res
            .status(500)
            .send({ message: "Error updating reset token.", status: false });
        });
    } else {
      return res.send({ message: "Mail Id does not exist.", status: false });
    }
  });
  // sendMail(resetLink).then(res => {

  //   res.send({ message: "Mail Sent to your mail ID." })
  // }).catch(err => {
  //   res.send({ message: "Mail Sent to your mail ID." })
  // });
  // const sql =
  // "UPDATE players SET reset_token = ?, reset_token_expires = NOW() + INTERVAL 1 HOUR WHERE email = ?";

  // mailTransporter.sendMail(mailDetails,
  // (err,info) => {
  //   console.log(1);
  //   if (err) {
  //     console.log("*****errr********",err);
  //     res.send('Email could not be sent.');
  //     return;
  //   }
  //  else{
  //   console.log("11111111111111");
  //   res.send({message:'Password reset email sent successfully!'});
  //  }
  // });
};

export const changePassword = async (req, res) => {
  let con = await getConnection();
  const { password, changePassword, token } = req.body;

  const resetTokenCheck = `SELECT
  id,
  TIMESTAMPDIFF(SECOND, created_at, NOW()) AS time_difference_seconds
  FROM players
  WHERE reset_token = ?`;
  const enc_pswrd = passwordEncryption(password);
  con
    .query(resetTokenCheck, [token])
    .then((data) => {
      console.log("-------->", data[0]);
      if (data[0].length >= 1) {
        // console.log("resettoekn data ", data[0]);
        const updatePassword = `UPDATE players SET password = ?,reset_token = NULL WHERE id=?;`;
        console.log(
          "data[0][0].time_difference_seconds",
          data[0][0].time_difference_seconds
        );
        if (data[0][0].time_difference_seconds < 60) {
          con
            .query(updatePassword, [enc_pswrd, data[0][0].id])
            .then((data) => {
              return res.status(200).send({
                status: true,
                message: "Password updated successfully.Use your new password to login",
              });
            })
            .catch((err) => {
              return res.send({ status: false, error: err });
            });
        } else {
          const deleteToken = `UPDATE players
        SET reset_token = NULL WHERE id=?;`;
          con
            .query(deleteToken, [data[0][0].id])
            .then((data) => {
              res.send({ message: "Token expired.", status: false });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        return res.send({ message: "Token Expired.", status: false });
      }
    })
    .catch((err) => {
      res.send({ message: err });
    });
};

export const logoutRoute = (req, res) => {
  res.clearCookie("token");
  return res.send({ Message: "User Logged out." });
};

export const resetPassword = (req, res) => {};

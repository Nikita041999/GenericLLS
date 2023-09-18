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
  firstname = wordCorrection(firstname);
  lastname = wordCorrection(lastname);
  email = email.trim().toLowerCase();
  institute = wordCorrection(institute);
  city = wordCorrection(city);
  country = wordCorrection(country);
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
  email = email.trim().toLowerCase();
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
            message:
              "Mail to reset the password has been sent to your mail Id.",
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
                message:
                  "Password updated successfully.Use your new password to login",
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

export const githubUserData = async (req, res) => {
  let con = await getConnection();
  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"),
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const insertUserWithoutEmail = `INSERT INTO players (social_id,avatar_url) VALUES (?,?)`;
      const insertUserWithEmail = `INSERT INTO players (social_id,email_address,avatar_url) VALUES (?,?,?)`;
      const idExistQuery = `select * from players where social_id=?`;
      if (data.email === null) {
        con
          .query(idExistQuery, [data.id])
          .then((data1) => {
            if (data1[0].length == 0) {
              con
                .query(insertUserWithoutEmail, [data.id, data.avatar_url])
                .then((val) => {
                  return res.send({
                    status: true,
                    message: "User logged in.",
                    data: data,
                  });
                });
            } else {
              return res.send({
                status: true,
                message: "User already exists.",
                data: data,
              });
            }
          })
          .catch((err) => {
            return res.send({ status: false, message: err });
          });
      } else {
        con
          .query(idExistQuery, [data.id])
          .then((data1) => {
            if (data1[0].length == 0) {
              con
                .query(insertUserWithEmail, [
                  data.id,
                  data.email,
                  data.avatar_url,
                ])
                .then((val) => {
                  return res.send({
                    status: true,
                    message: "User logged in.",
                    data: data,
                  });
                });
            } else {
              return res.send({
                status: true,
                message: "User already exists.",
                data: data,
              });
            }
          })
          .catch((err) => {
            return res.send({ status: false, message: err });
          });
      }
    });
};

export const githubAccessToken = async (req, res) => {
  const params =
    "?client_id=" +
    process.env.Github_ClientID +
    "&client_secret=" +
    process.env.Github_Client_Secret +
    "&code=" +
    req.query.code;
  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      res.json(data);
    });
};
export const googleAccessToken = async (req, res) => {
  const code = req.query.code;

  const tokenUrl = "https://accounts.google.com/o/oauth2/token";
  const tokenData = `code=${code}&client_id=${process.env.Google_ClientID}&client_secret=${process.env.Google_Client_Secret}&redirect_uri=${process.env.Google_Redirect_URI}&grant_type=authorization_code`;

  await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: tokenData,
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("------>", data);
      return res.json(data);
    });
};
export const googleUserData = async (req, res) => {
  let con = await getConnection();
  const userResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        // Authorization: `Bearer ${access_token}`,
        Authorization: req.get("Authorization"),
      },
    }
  );
  const userData = await userResponse.json();
  console.log("userData", userData);
  const name = userData.name.split(" ");
  console.log(name);
  const insertUserWithEmail = `INSERT INTO players (firstname,lastname,social_id,email_address,avatar_url) VALUES (?,?,?,?,?)`;
  const idExistQuery = `select * from players where social_id=?`;
  con
    .query(idExistQuery, [userData.id])
    .then((data1) => {
      if (data1[0].length == 0) {
        console.log(0);
        con
          .query(insertUserWithEmail, [
            name[0],
            name[1],
            userData.id,
            userData.email,
            userData.picture,
          ])
          .then((val) => {
            console.log("data.....", userData);
            return res.send({
              status: true,
              message: "User logged in.",
              data: userData,
            });
          });
      } else {
        return res.send({
          status: true,
          message: "User already exists.",
          data: userData,
        });
      }
    })
    .catch((err) => {
      return res.send({ status: false, message: err });
    });
};

export const linkedAccessToken = async (req, res) => {
  const { code } = req.query;
  console.log(1);
  console.log(code);
  // Prepare the request parameters
  const tokenData = `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.Google_Redirect_URI}&client_id=${process.env.LinkedIn_CLientID}&client_secret=${process.env.LinkedIn_CLient_Secret}`;

  await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: tokenData,
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("------>", data);
      return res.json(data);
    });
};

export const linkedAccessData = async (req, res) => {
  const userResponse = await fetch("https://api.linkedin.com/v2/me", {
    headers: {
      Authorization: req.get("Authorization"),
    },
  });
  const userData = await userResponse.json();
  console.log("userData--------->", userData);
  // const name = userData.name.split(" ");
  // console.log(name);
  // const insertUserWithEmail = `INSERT INTO players (firstname,lastname,social_id,email_address,avatar_url) VALUES (?,?,?,?,?)`;
  // const idExistQuery = `select * from players where social_id=?`;
  // con
  //   .query(idExistQuery, [userData.id])
  //   .then((data1) => {
  //     if (data1[0].length == 0) {
  //       console.log(0);
  //       con
  //         .query(insertUserWithEmail, [
  //           name[0],
  //           name[1],
  //           userData.id,
  //           userData.email,
  //           userData.picture,
  //         ])
  //         .then((val) => {
  //           console.log("data.....", userData);
  //           return res.send({
  //             status: true,
  //             message: "User logged in.",
  //             data: userData,
  //           });
  //         });
  //     } else {
  //       return res.send({
  //         status: true,
  //         message: "User already exists.",
  //         data: userData,
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     return res.send({ status: false, message: err });
  //   });
};
export const facebookAccessToken = async (req, res) => {
  const { code } = req.query;
  // Prepare the request parameters
  // const tokenData = await fetch(
  //   `client_id=${process.env.Facebook_ClientID}&redirect_uri=${process.env.Google_Redirect_URI}&client_secret=${process.env.Facebook_Client_Secret}&code=${code}`
  // );

  await fetch(
    `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${process.env.Facebook_ClientID}&redirect_uri=${process.env.Google_Redirect_URI}&client_secret=${process.env.Facebook_Client_Secret}&code=${code}`
  )
    // await fetch("https://graph.facebook.com/v11.0/oauth/access_token", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   body: `client_id=${process.env.Facebook_ClientID}&redirect_uri=${process.env.Google_Redirect_URI}&client_secret=${process.env.Facebook_Client_Secret}&code=${code}`,
    // })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("------>", data);
      return res.json(data);
    });
};
export const facebookAccessData = async (req, res) => {
  // https://graph.facebook.com/v12.0/oauth/access_token?${querystring.stringify(tokenParams)}
  const userResponse = await fetch("https://graph.facebook.com/v12.0/oauth", {
    headers: {
      Authorization: req.get("Authorization"),
    },
  });
  const userData = await userResponse.json();
  console.log("userData--------->", userData);
};

export const twitterAccessToken = async (req, res) => {
  const { code } = req.query;
  const twitterAuthParams = {
    consumer_key: process.env.Twitter_Consumer_Key,
    consumer_secret: process.env.Twitter_Consumer_Secret,
    // oauth_verifier: code,
  };
  const twitterAuthHeaders = {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  };

  const url = "https://api.twitter.com/2/oauth2/token";
  const clientId = "QkZMQXVNXzAxWlcyZ21WU0daZGo6MTpjaQ";
  const redirectUri = "http://localhost:3000";
  const code_challenge = "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8";
  const clientSecret = "vqc3uwmGWXAU0KTDr_5aI2lrMZwfJXfc2r87o33E5myAtYH-mw";
  const body = new URLSearchParams();
  body.append("grant_type", "authorization_code");
  body.append("client_id", clientId);

  body.append("redirect_uri", redirectUri);
  body.append("code_verifier", code_challenge);
  body.append("code", code);

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`, // Add Basic authorization header
  };
  fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("********", data);
      // console.log("------>", data);
      return res.json(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const twitterAccessData = async (req, res) => {
  // we need to encrypt our twitter client id and secret here in base 64 (stated in twitter documentation)
  //   const url = 'https://api.twitter.com/2/me';
  //   console.log("%%%%%",req.get("Authorization"));
  // const headers = {
  //   'Authorization': req.get("Authorization"),
  // };

  if (req.get("Authorization")) {
    const accessToken = req.get("Authorization");
    console.log("_________",accessToken);
    const userResponse = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        // "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("++++++++", userResponse);
  }
  // const userData = await userResponse.json();
  // console.log("userData--------->", userData);

  // twitterOauthTokenParams = {
  //   client_id: process.env.Twitter_ClientID,
  //   // based on code_challenge
  //   code_verifier: "8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA",
  //   redirect_uri: `http://www.localhost:3000`,
  //   grant_type: "authorization_code",
  // };
  // const tokenParams = new URLSearchParams({
  //   ...twitterOauthTokenParams,
  //   code,
  // });
  // const headers = {
  //   "Content-Type": "application/x-www-form-urlencoded",
  //   Authorization: `Basic ${BasicAuthToken}`,
  // };
  // const requestOptions = {
  //   method: "POST",
  //   headers: headers,
  //   body: tokenParams.toString(),
  // };

  // await fetch("https://api.twitter.com/2/oauth2/token", requestOptions)
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
  //     console.log("------>", data);
  //     return res.json(data);
  //   });
  // fetch(url, {
  //   method: "POST",
  //   headers: headers
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log("----->",data);
  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });
};

export const anc = async (req, res) => {};

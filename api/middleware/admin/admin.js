import { getConnection } from "../../db/index.js";

import CryptoJS from "crypto-js";
import { generateJWT } from "../../utils/jwt.js";

export const login = async () => {
  console.log("11111");
  let { email, password } = req.body;
  console.log("=====>", password);
  password = CryptoJS.SHA512(password, process.env.EncryptionKEY).toString();
  console.log("newPassword**********", email, password);
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
      })
      .then(() => con.end());
  } else {
    res.send({
      data: [],
      message: "EmailId or password is required",
      status: false,
    });
  }
};

export const changePassword = async () => {};

export const forgetPassword = async () => {};

export const quizDataAdd = async (req, res) => {
  console.log(Object.keys(req.body).length);
  let { question, answer } = req.body;
  question = question.trim();
  answer = answer.trim();
  let con = await getConnection();
  const qddQuestionQuery = "insert into questions (questions) values(?)";
  const optinIdQuery = "select * from question_options where question_id=? and options=?";
  const addOptionQuery =
    "insert into question_options (question_id,options) values (?,?)";
  const addOptionAnswerQuery =
    "insert into question_option_answers (question_id,option_id) values(?,?)";
  con
    .query(qddQuestionQuery, [question])
    .then(async (data) => {
      const q_id_query = "select question_id from questions where questions=?";
      const q_id = await con.query(q_id_query, [question]);
      console.log("Object.entries(req.body)>>>>>>", Object.entries(req.body));
      const option_length = Object.entries(req.body).length;
      console.log("*****q_id****", q_id[0][0].question_id);
      Object.entries(req.body).map(async (opt, index) => {
        if (opt[0].includes("option")) {
          await con.query(addOptionQuery, [
            q_id[0][0].question_id,
            opt[1].trim(),
          ]);
        }
      });
      con.query(optinIdQuery, [q_id[0][0].question_id,answer]).then(async (val) => {
        console.log("val******", val[0][0].option_id);
        con.query(addOptionAnswerQuery, [q_id[0][0].question_id, val[0][0].option_id]).then(() => res.send({message:"Data inserted successfully"}));
      });
    })
    .catch((err) => res.send({ err: err }));
};

export const quizList = async(req,res) => {
  const con = await getConnection()
  const getQuizListQuery = "select * from questions"
  con.query(getQuizListQuery,[]).then(data => {
    if(data.length>0){
      res.status(200).send({data:data[0],status:true,message:"All question List"})
    }
  })
}
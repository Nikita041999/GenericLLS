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
  console.log(req.body);
  let { question, selectField } = req.body;
  question = question.trim();
  Object.entries(req.body).map(async (opt, index) => {
    if (opt[0].includes("option")) {
      const ansOpt = opt[0][opt[0].length - 1];
      if (selectField === ansOpt) {
        // console.log(answer,opt[1]);
        selectField = opt[1].trim();
      }
    }
  });
  console.log("answer------>", selectField);
  let con = await getConnection();
  const checkQuestionExistQuery = "select * from questions where questions = ?";
  const qddQuestionQuery = "insert into questions (questions) values(?)";
  const optinIdQuery =
    "select * from question_options where question_id=? and options=?";
  const addOptionQuery =
    "insert into question_options (question_id,options) values (?,?)";
  const addOptionAnswerQuery =
    "insert into question_option_answers (question_id,option_id) values(?,?)";

  // insert question in table
  con
    .query(checkQuestionExistQuery, [question])
    .then(async (quesList) => {
      console.log("--quesList[0].length > 0)---->", quesList[0].length > 0);
      if (!(quesList[0].length > 0)) {
        const data = await con.query(qddQuestionQuery, [question]);
        const q_id_query =
          "select question_id from questions where questions=?";
        //get question id from table
        const q_id = await con.query(q_id_query, [question]);
        console.log("Object.entries(req.body)>>>>>>", Object.entries(req.body));
        const option_length = Object.entries(req.body).length;
        console.log("*****q_id****", q_id[0][0].question_id);
        Object.entries(req.body).map(async (opt, index) => {
          if (opt[0].includes("option")) {
            //add option with respective question id
            await con.query(addOptionQuery, [
              q_id[0][0].question_id,
              opt[1].trim(),
            ]);
          }
        });
        con
          .query(optinIdQuery, [q_id[0][0].question_id, selectField])
          .then(async (val) => {
            console.log("val******", val[0][0].option_id);
            con
              .query(addOptionAnswerQuery, [
                q_id[0][0].question_id,
                val[0][0].option_id,
              ])
              .then(() => res.send({ message: "Data inserted successfully" }));
          });
      } else {
        console.log("Question already exists");
        res.send({ message: "Question already exists" });
      }
    })
    .catch((err) => res.send({ err: err }));
};

export const quizList = async (req, res) => {
  const con = await getConnection();
  console.log(">>>>body", req.body, Object.keys(req.body).length);
  const getQuizListQuery = "select * from questions";
  con.query(getQuizListQuery, []).then((data) => {
    if (data.length > 0) {
      res
        .status(200)
        .send({ data: data[0], status: true, message: "All question List" });
    }
  });
};

export const editQuizList = (req, res) => {
  console.log("*******", req.body);
  const { type, questions, order_id } = req.body;
  const getQuestionQuery = 
    "select * from questions where type=? and questions=?";
  // con.query(getQuestionQuery, []);
};

export const deleteQuizList = async (req, res) => {
  console.log("In");
  const { id } = req.body;
  console.log("id***", id);
  // const deleteAnsWerQuery = ""
  // const deleteOptionQuery = ""
  // const deleteQuestionQuery = "Delete from "
  const deleteQuestionQuery = `DELETE q, a, c
  FROM question_option_answers AS q
  LEFT JOIN question_options AS c ON q.question_id = c.question_id
  LEFT JOIN questions AS a ON q.question_id = a.question_id
  WHERE q.question_id= ?`;
  const con = await getConnection();
  con
    .query(deleteQuestionQuery, [id])
    .then((data) => {
      res.send({ message: "Deleted Data" });
    })
    .catch((err) => {
      console.log("****", err);
      res.send({ message: `Error in deleteing data ${err}` });
    });
};

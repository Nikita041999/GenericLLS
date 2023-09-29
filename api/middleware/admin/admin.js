import { getConnection } from "../../db/index.js";

import CryptoJS from "crypto-js";
import { generateJWT } from "../../utils/jwt.js";

export const login = async () => {
  let { email, password } = req.body;
  password = CryptoJS.SHA512(password, process.env.EncryptionKEY).toString();
  if ((email, password)) {
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
            if (index < option_length) {
              await con.query(addOptionQuery, [
                q_id[0][0].question_id,
                opt[1].trim(),
              ]);
            }
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

export const getSingleQuestionData = async (req, res) => {
  console.log("*******", req.body);
  const { id } = req.body;
  const getQuestionQuery = `SELECT
	q.question_id,
    q.type,
    q.questions,
    q.order_id,
    o.option_id,
    o.options,
    
    a.option_id as answer_id
FROM
    questions AS q
INNER JOIN
    question_options AS o ON q.question_id = o.question_id
INNER JOIN
    question_option_answers AS a ON q.question_id = a.question_id
    WHERE
    q.question_id = ?;`;
  const con = await getConnection();
  con
    .query(getQuestionQuery, [id])
    .then((data) => {
      console.log("data****", data[0]);
      res.send({ data: data[0], status: true });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: `${err}` });
    });
};

export const deleteQuizList = async (req, res) => {
  const { id } = req.body;
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

function arraysAreEqual(arr1, arr2) {
  return (
    arr1.length === arr2.length &&
    arr1.every((value, index) => value === arr2[index])
  );
}

export const editQuestionData = async (req, res) => {
  console.log("--->", req.body);
  let { id, question, options, selectField, option_length } = req.body;
  question = question.trim();
  const updateQuestionQurey = `UPDATE questions
SET questions = ?
WHERE question_id = ?;`;
  const optinIdQuery =
    "select * from question_options where question_id=? and options=?";
  //   const updateOptionQuery = `Update question_options SET options=? where  option_id=?  `;
  const getPreviousOptions = `select * from question_options where question_id=?`;
  const deleteAllOptionQuery = `delete from question_options where option_id=?`;
  const addOptionQuery =
    "insert into question_options (question_id,options) values (?,?)";
  const updateAnswerQuery = `Update question_option_answers SET option_id=? where  question_id=? `;
  const deleteAnswerQuery = ` delete from question_option_answers where question_id=?`;
  const addOptionAnswerQuery =
    "insert into question_option_answers (question_id,option_id) values(?,?)";
  //   const optinIdQuery =
  //     "select * from question_options where question_id=? and options=?";
  console.log("****", option_length);
  console.log("req.body----->", req.body);
  let option_list = {};
  const regex = /option[A-Z]/g;
  Object.entries(req.body).map(async (opt, index) => {
    if (opt[0].match(regex)) {
      console.log("******", index, option_length);
      console.log(">>>>>>", opt[0]);
      option_list[opt[0]] = req.body[opt[0]];
    }
  });
  let final_option_list = {};
  Object.entries(option_list).map(async (opt, index) => {
    if (opt[0].match(regex) && index < option_length) {
      final_option_list[opt[0]] = option_list[opt[0]];
    }
  });
  console.log("option_list--->", final_option_list);

  Object.entries(req.body).map(async (opt, index) => {
    if (opt[0].includes("option") && opt[0] != "options") {
      const ansOpt = opt[0][opt[0].length - 1];
      if (selectField === ansOpt) {
        selectField = opt[1].trim();
      }
    }
  });
  console.log("answer------>", selectField);
  const con = await getConnection();
  con
    .query(updateQuestionQurey, [question, id])
    .then(async (data) => {
      const prevOpt = await con.query(getPreviousOptions, [id]);
      let array1 = [];
      prevOpt[0].map((data) => {
        array1.push(data["option_id"]);
      });
      await con.query(deleteAnswerQuery, [id]);
      console.log(">>>>>>", array1);
      array1.map(async (opt, i) => {
        await con.query(deleteAllOptionQuery, [opt]);
      });

      Object.entries(final_option_list).map(async (opt, index) => {
        //add option with respective question id
        await con.query(addOptionQuery, [id, opt[1].trim()]);
      });
      con.query(optinIdQuery, [id, selectField]).then(async (val) => {
        console.log("val******", val[0][0].option_id);
        con
          .query(addOptionAnswerQuery, [id, val[0][0].option_id])
          .then(() =>
            res.send({ message: "Data updated successfully", status: true })
          );
      });
    })
    .catch((err) => {
      res.send({ message: `Cannot update data, err${err}`, status: false });
    });
};

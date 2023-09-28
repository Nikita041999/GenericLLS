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
  let { id, question, options, selectField } = req.body;

  const updateQuestionQurey = `UPDATE questions
SET questions = ?
WHERE question_id = ?;`;

  const updateOptionQuery = `Update question_options SET options=? where  option_id=?  `;
  const getPreviousOptions = `select * from question_options where question_id=?`;
  const updateAnswerQuery = `Update question_option_answers SET option_id=? where  question_id=? `;
  const optinIdQuery =
    "select * from question_options where question_id=? and options=?";

  const con = await getConnection();
  con
    .query(updateQuestionQurey, [question, id])
    .then(async (data) => {
      const prevOpt = await con.query(getPreviousOptions, [id]);
      let array1 = [];
      prevOpt[0].map((data) => {
        array1.push(data["option_id"]);
      });
      Object.entries(req.body).map(async (opt, index) => {
        if (opt[0].includes("option") && opt[0] != "options") {
          const ansOpt = opt[0][opt[0].length - 1];
          console.log("selectField*", selectField, ansOpt);
          if (selectField === ansOpt) {
            selectField = opt[1].trim();
          }
        }
      });
      const temp = Object.keys(options);
      let array2 = [];
      temp.forEach((element) => {
        array2.push(parseInt(element));
      });

      let finalOptions = {};
      let option1 = [];
      let extraOptions = [];
      let max_index = 0;
      // if (array1.length == array2.length) {
      //   finalOptions = { ...options };
      //   Object.entries(req.body).map((opt, i) => {
      //     if (opt[0].includes("option") && opt[0] != "options") {
      //       option1.push(opt[1]);
      //     }
      //   });
      //   option1.map((opt, i) => {
      //     Object.keys(finalOptions).map((v, index) => {
      //       {
      //         if (i === index) {
      //           finalOptions[v] = opt;
      //         }
      //       }
      //     });
      //   });
      // } else if (array1.length > array2.length) {
      //   finalOptions = { ...options };
      //   Object.entries(req.body).map((opt, i) => {
      //     if (opt[0].includes("option") && opt[0] != "options") {
      //       option1.push(opt[1]);
      //     }
      //   });

      //   Object.keys(finalOptions).map((opt, i) => {
      //     option1.map((v, index) => {
      //       {
      //         if (i === index) {
      //           finalOptions[v] = opt;
      //           max_index = i;
      //         }
      //       }
      //     });
      //   });
      //   if (max_index < Object.keys(finalOptions).length - 1) {
      //     Object.keys(finalOptions).map((opt, i) => {
      //       if (i > max_index) {
      //         console.log(
      //           "*****Object.keys(finalOptions)[i]***",
      //           Object.keys(finalOptions)[i]
      //         );
      //         extraOptions.push(Object.keys(finalOptions)[i]);
      //       }
      //     });
      //   }
      // } else {
      //   finalOptions = { ...options };
      //   Object.entries(req.body).map((opt, i) => {
      //     if (opt[0].includes("option") && opt[0] != "options") {
      //       option1.push(opt[1]);
      //     }
      //   });
      //   option1.map((opt, i) => {
      //     Object.keys(finalOptions).map((v, index) => {
      //       {
      //         if (i === index) {
      //           finalOptions[v] = opt;
      //           max_index = index
      //         }
      //       }
      //     });
      //   });
      //   if (max_index < option1.length - 1) {
      //     option1.map((opt, i) => {
      //       if (i > max_index) {
      //         console.log(
      //           "*****Object.keys(finalOptions)[i]***",
      //           Object.keys(finalOptions)[i]
      //         );
      //         extraOptions.push(opt);
      //       }
      //     });
      //   }
      //     }
      //   });
      // }

      // if arrays are equal, just update all values
      // if (arraysAreEqual(array1, array2)) {
      //   finalOptions = { ...options };
      //   Object.entries(req.body).map((opt, i) => {
      //     if (opt[0].includes("option") && opt[0] != "options") {
      //       option1.push(opt[1]);
      //     }
      //   });
      //   option1.map((opt, i) => {
      //     Object.keys(finalOptions).map((v, index) => {
      //       {
      //         if (i === index) {
      //           finalOptions[v] = opt;
      //         }
      //       }
      //     });
      //   });

      //   Object.entries(finalOptions).map(async (opt, index) => {
      //     con
      //       .query(updateOptionQuery, [opt[1].trim(), opt[0]])
      //       .then((data1) => {
      //         con.query(optinIdQuery, [id, selectField]).then((data) => {
      //           con
      //             .query(updateAnswerQuery, [data[0][0].option_id, id])
      //             .then((data2) => {
      //               res.send({
      //                 message: "Data has been updated",
      //                 status: true,
      //               });
      //             });
      //         });
      //       });
      //   });
      // }

      // //if array is one array is deleted array1 is prev array and array 2 is curr array
      // else if (array1.length > array2.length) {
      //   finalOptions = { ...options };
      //   Object.entries(req.body).map((opt, i) => {
      //     if (opt[0].includes("option") && opt[0] != "options") {
      //       option1.push(opt[1]);
      //     }
      //   });

      //   Object.keys(finalOptions).map((opt, i) => {
      //     option1.map((v, index) => {
      //       {
      //         if (i === index) {
      //           finalOptions[v] = opt;
      //           max_index = i;
      //         }
      //       }
      //     });
      //   });
      //   if (max_index < Object.keys(finalOptions).length - 1) {
      //     Object.keys(finalOptions).map((opt, i) => {
      //       if (i > max_index) {
      //         console.log(
      //           "*****Object.keys(finalOptions)[i]***",
      //           Object.keys(finalOptions)[i]
      //         );
      //         extraOptions.push(Object.keys(finalOptions)[i]);
      //       }
      //     });
      //   }

      //   const deleteOptionQuery = `delete from question_options where question_id=? and option_id=?`;
      //   Object.entries(finalOptions).map(async (opt, index) => {
      //     con
      //       .query(updateOptionQuery, [opt[1].trim(), opt[0]])
      //       .then((data1) => {
      //         //delete extra options
      //         extraOptions.forEach(async (val) => {
      //           await con.query(deleteOptionQuery, [id, val]);
      //         });
      //         con.query(optinIdQuery, [id, selectField]).then((data) => {
      //           con
      //             .query(updateAnswerQuery, [data[0][0].option_id, id])
      //             .then(async (data2) => {
      //               res.send({
      //                 message: "Data has been updated",
      //                 status: true,
      //               });
      //             });
      //         });
      //       });
      //   });
      // } else {
      //   // if an option was added from frontend
      //   finalOptions = { ...options };
      //   Object.entries(req.body).map((opt, i) => {
      //     if (opt[0].includes("option") && opt[0] != "options") {
      //       option1.push(opt[1]);
      //     }
      //   });
      //   option1.map((opt, i) => {
      //     Object.keys(finalOptions).map((v, index) => {
      //       {
      //         if (i === index) {
      //           finalOptions[v] = opt;
      //           max_index = index;
      //         }
      //       }
      //     });
      //   });
      //   if (max_index < option1.length - 1) {
      //     option1.map((opt, i) => {
      //       if (i > max_index) {
      //         console.log(
      //           "*****Object.keys(finalOptions)[i]***",
      //           Object.keys(finalOptions)[i]
      //         );
      //         extraOptions.push(opt);
      //       }
      //     });
      //   }
      //   const updateNewOptionEntries =
      //     "insert into question_options (question_id,options) values (?,?)";
      //   Object.entries(finalOptions).map(async (opt, index) => {
      //     con
      //       .query(updateOptionQuery, [opt[1].trim(), opt[0]])
      //       .then((data1) => {
      //         extraOptions.forEach(async (val) => {
      //           await con.query(updateNewOptionEntries, [id, val]);
      //         });
      //         con.query(optinIdQuery, [id, selectField]).then((data) => {
      //           con
      //             .query(updateAnswerQuery, [data[0][0].option_id, id])
      //             .then(async (data2) => {
      //               //delete extra options
      //               res.send({
      //                 message: "Data has been updated",
      //                 status: true,
      //               });
      //             });
      //         });
      //       });
      //   });
      // }

    })
    .catch((err) => {
      res.send({ message: `Cannot update data, err${err}`, status: false });
    });
};

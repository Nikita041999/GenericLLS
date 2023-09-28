import Layout from "components/Layout";
import React, { useContext, useEffect, useState } from "react";
import userSvg from "assets/images/users.svg";
import editSvg from "assets/images/edit-icon.svg";
import eventSvg from "assets/images/events.svg";
import { quizQuestionList } from "lib/network/loginauth";
import styles from "./AdminStyles.module.css";
import Loader from "components/Loader";
import { MdEdit, MdDataSaverOn } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { getSingleQuestionData } from "lib/network/loginauth";
import { RiSaveLine } from "react-icons/ri";
import { deleteQuizData } from "lib/network/loginauth";
// import {FaEdit} from 'react-icons/fa'
import { QuestionContext } from "lib/contexts/questionContext";
import { useNavigate } from "react-router-dom";

const QuestionList = () => {
  const { questionId, setQuestionId,handleEditQuestionId } = useContext(QuestionContext);
  const navigate = useNavigate()
  const [questionList, setQuestionList] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [editedType, setEditedType] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  // Add a new state variable to track the edited question text
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  // const [typeValue, setTypeValue] = useState("");
  const getQuestionList = () => {
    return quizQuestionList()
      .then((data) => {
        console.log("data---->", data.data.data);
        setQuestionList(data.data.data);
        return data;
      })
      .catch((err) => console.log("errrr--->", err));
  };

  // Function to handle editing of a question
  const handleQuestionEdit = (e, tableId) => {
    // Find the question being edited
    // console.log("questionList****", questionList);
    const editedQuestion = questionList.find(
      (user, index) => index + 1 === tableId
    );

    if (editedQuestion) {
      // If the question is found, set it as the edited question text
      handleEditQuestionId(editedQuestion.question_id)
      setEditedQuestion(editedQuestion.questions);
      setEditedType(editedQuestion.type);
      setEditOrder(editedQuestion.order_id);
      setEditingQuestionId(tableId);
      setIsEditable(!isEditable);
      navigate("/edit-question");
    }
  };
  const handleQuestionSave = () => {
    // Find the question being edited

    const editedQuestionIndex = questionList.findIndex(
      (user, index) => index + 1 === editingQuestionId
    );
    if (editedQuestionIndex !== -1) {
      // If the question is found, update it with the edited text
      const updatedQuestionList = [...questionList];
      updatedQuestionList[editedQuestionIndex].questions = editedQuestion;
      updatedQuestionList[editedQuestionIndex].type = editedType;
      updatedQuestionList[editedQuestionIndex].order_id = editOrder;
      getSingleQuestionData(updatedQuestionList[editedQuestionIndex])
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log("----->", err));
      console.log("***updatedQuestionList***", updatedQuestionList);
      setQuestionList(updatedQuestionList);
      setIsEditable(false);
    }
  };

  const handleQuestionDelete = (e, tableId) => {
    const editedQuestionIndex = questionList.findIndex(
      (user, index) => index + 1 === tableId
    );
    console.log(editedQuestionIndex, questionList[editedQuestionIndex]);
    const { question_id: id } = questionList[editedQuestionIndex];
    console.log("id", id);
    const value = {
      id,
    };
    deleteQuizData(value)
      .then((data) => {
        console.log("message--->", data);
        getQuestionList();
      })
      .catch((err) => {
        console.log("errr-> ", err);
      });
  };
  useEffect(() => {
    console.log("quesList--->", questionList);
  }, [questionList]);

  useEffect(() => {
    getQuestionList();
  }, []);
  const handleTypeChange = (e) => {
    setEditedType(e.target.value);
  };
  const handleQuestionChange = (e) => {
    setEditedQuestion(e.target.value);
  };
  const handleEditOrder = (e) => {
    setEditOrder(e.target.value);
  };

  const getList = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="20" align="center">
            <Loader />
          </td>
        </tr>
      );
    } else {
      return questionList?.length ? (
        questionList.map((user, i) => {
          return (
            <tr key={i + 1} id={`table_row_${i + 1}`}>
              <td>{i + 1}</td>
              <td>{user.type}</td>
              <td>{user.questions}</td>
              <td>{user.order_id}</td>
              <td className={styles.button_wrapper}>
                <div>
                  <button
                    style={{
                      background: "#c5c6d0",
                      color: "#333333",
                    }}
                    onClick={(e) => handleQuestionEdit(e, i + 1)}
                  >
                    <MdEdit
                      width={200}
                      onClick={(e) => handleQuestionEdit(e, i + 1)}
                    />
                  </button>
                  <button
                    style={{
                      background: "#202320",
                      color: "#c5c6d0",
                    }}
                    onClick={(e) => handleQuestionDelete(e, i + 1)}
                  >
                    <AiOutlineDelete width={200} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan="20" align="center">
            No Players found
          </td>
        </tr>
      );
    }
  };
  return (
    <Layout>
      <main className="main-body">
        <div className="content">
          <div className="row flex-fill justify-content-between">
            <div className="col-md-12">
              <div>
                <h1>Welcome Admin</h1>
                <div
                  style={{ background: "#F5F5F5" }}
                  className={`${styles.list_wrapper} row mt-4`}
                >
                  <div className={`col-md-12 col-lg-6 col-xl-4`}>
                    <a href="/users">
                      <div className="card_dash mb-3">
                        <div className="cardinfo">
                          <label>Total Quizes Conducted</label>
                          <strong>{/* {data.present_players} */}</strong>
                        </div>
                        <div className="cardIcon">
                          <img src={userSvg} alt="icon" />
                        </div>
                      </div>
                    </a>
                    <a href="/users" style={{ marginLeft: "1rem" }}>
                      <div className="card_dash mb-3">
                        <div className="cardinfo">
                          <label>Total Quizes Conducted</label>
                          <strong>{/* {data.present_players} */}</strong>
                        </div>
                        <div className="cardIcon">
                          <img src={userSvg} alt="icon" />
                        </div>
                      </div>
                    </a>
                  </div>
                  {/* <ul>
                    {questionList?.map((ques, index) => {
                      return (
                        <li key={index} className={styles.question_warpper}>
                          <div>
                            <div>
                              {" "}
                              <span style={{ marginRight: "0.5rem" }}>{`${
                                index + 1
                              }. `}</span>{" "}
                              {ques.questions}
                            </div>
                            <div className={`${styles.button_wrapper}`}>
                              <button
                                style={{
                                  background: "#c5c6d0",
                                  color: "#333333",
                                }}
                                onClick={handleQuestionEdit}
                              >
                                Edit
                              </button>
                              <button
                                style={{
                                  background: "#202320",
                                  color: "#c5c6d0",
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>{" "}
                        </li>
                      );
                    })}
                  </ul> */}
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className={styles.textcenter}>#</th>
                          <th>Type</th>
                          <th>Question</th>
                          <th>Order</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{questionList?.length > 0 && getList()}</tbody>
                    </table>
                  </div>

                  {/* <Pagination
                    totalItems={data.totalItems}
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    getData={getData}
                    limit={data.limit}
                    loading={isLoading}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default QuestionList;

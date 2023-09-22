import Layout from "components/Layout";
import React, { useEffect, useState } from "react";
import userSvg from "assets/images/users.svg";
import editSvg from "assets/images/edit-icon.svg";
import eventSvg from "assets/images/events.svg";
import { quizQuestionList } from "lib/network/loginauth";
import styles from "./AdminStyles.module.css";
import Loader from "components/Loader";
import { MdEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { editQuizData } from "lib/network/loginauth";
// import {FaEdit} from 'react-icons/fa'

const QuestionList = () => {
  const [questionList, setQuestionList] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [typeValue, setTypeValue] = useState("");
  const getQuestionList = () => {
    return quizQuestionList()
      .then((data) => {
        console.log("data---->", data.data.data);
        setQuestionList(data.data.data);
        return data;
      })
      .catch((err) => console.log("errrr--->", err));
  };
  const handleQuestionEdit = (e,tableId) => {
    // editQuizDat
    const tbl_row = document.getElementById(`table_row_${tableId}`);
    console.log('---->',tbl_row.getElementsByTagName('td')[2].textContent)

    // console.log("****a ",a);
    setIsEditable(!isEditable);
    setTypeValue();
  };

  useEffect(() => {
    getQuestionList();
  }, []);
  const handleTypeChange = (e) => {
    setTypeValue(e.target.value);
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
              {isEditable ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={typeValue}
                      onChange={handleTypeChange}
                      onBlur={handleQuestionEdit}
                    />
                  </td>
                  <td>{user.questions}</td>
                  <td>{user.order_id}</td>
                </>
              ) : (
                <>
                  <td>{user.type}</td>
                  <td>{user.questions}</td>
                  <td>{user.order_id}</td>
                </>
              )}
              <td className={styles.button_wrapper}>
                <div>
                  <button
                    style={{
                      background: "#c5c6d0",
                      color: "#333333",
                    }}
                    onClick={(e)=>handleQuestionEdit(e,i+1)}
                  >
                    <MdEdit width={200} />
                  </button>
                  <button
                    style={{
                      background: "#202320",
                      color: "#c5c6d0",
                    }}
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

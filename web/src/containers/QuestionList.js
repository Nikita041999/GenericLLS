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
import { RiDeleteBin2Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
import { getSingleQuestionData } from "lib/network/loginauth";
import { RiSaveLine } from "react-icons/ri";
import questionListSvg from "assets/images/multi-picklist.svg";
import { deleteQuizData } from "lib/network/loginauth";
// import {FaEdit} from 'react-icons/fa'
import { toast } from "react-toastify";
// import { QuestionContext } from "lib/contexts/questionContext";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteModal from "components/Modals/DeleteModal";
import { Modal } from "react-bootstrap";
import Pagination from "components/Pagination";
import JsonToExcelConverter from "components/TradeshowComps/Admin/JsonToExcelConverter";

const QuestionList = () => {
  // const { questionId, setQuestionId, handleEditQuestionId } =
  //   useContext(QuestionContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [questionList, setQuestionList] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [editedType, setEditedType] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [totalQuestons, setTotalQuestions] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageData, setPageData] = useState({
    currentPage: location?.state?.currentPage || 1,
    limit: 5,
  });
  // Add a new state variable to track the edited question text
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const getQuestionList = (paginationParams = {}) => {
    let params = {
      page: paginationParams.page || 1,
      limit: pageData.limit,
      search: paginationParams.search || "",
      isSearchKeyword: paginationParams.search,
    };
    return quizQuestionList(params)
      .then((data) => {
        // console.log("data---->", data.data);
        setQuestionList(data.data);
        setTotalQuestions(data.data.totalItems);
        // setPageData(prev => {
        //  return ({...prev,currentPage})
        // })
        return data;
      })
      .catch((err) => console.log("errrr--->", err));
  };

  useEffect(() => {
    let params = {};
    if (location) {
      params.page = location?.state?.currentPage;
    }
    getQuestionList(params);
  }, [location,searchKeyword]);

  // Function to handle editing of a question
  const handleQuestionEdit = (e, tableId) => {
    // Find the question being edited
    // console.log("questionList****", questionList);
    const editedQuestion = questionList.data.find(
      (user, index) => index + 1 === tableId
    );

    if (editedQuestion) {
      // If the question is found, set it as the edited question text
      // handleEditQuestionId(editedQuestion.question_id);
      setEditedQuestion(editedQuestion.questions);
      setEditedType(editedQuestion.type);
      setEditOrder(editedQuestion.order_id);
      setEditingQuestionId(tableId);
      setIsEditable(!isEditable);
      localStorage.setItem("location", "edit_quiz");
      // console.log("editedQuestion.questionId", editedQuestion.question_id);
      localStorage.setItem("question_id", editedQuestion.question_id);
      navigate(`/edit-question?id=${editedQuestion.question_id}`);
    }
  };
  const handleQuestionSave = () => {
    // Find the question being edited

    const editedQuestionIndex = questionList.data.findIndex(
      (user, index) => index + 1 === editingQuestionId
    );
    if (editedQuestionIndex !== -1) {
      // If the question is found, update it with the edited text
      const updatedQuestionList = [...questionList.data];
      updatedQuestionList[editedQuestionIndex].questions = editedQuestion;
      updatedQuestionList[editedQuestionIndex].type = editedType;
      updatedQuestionList[editedQuestionIndex].order_id = editOrder;
      getSingleQuestionData(updatedQuestionList[editedQuestionIndex])
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log("----->", err));
      // console.log("***updatedQuestionList***", updatedQuestionList);
      setQuestionList(updatedQuestionList);
      setIsEditable(false);
    }
  };

  const handleQuestionDelete = (e, tableId) => {
    const editedQuestionIndex = questionList.data.findIndex(
      (user, index) => index + 1 === tableId
    );
    // setShowModal(!showModal)
    // console.log(editedQuestionIndex, questionList.data[editedQuestionIndex]);
    const { question_id: id } = questionList.data[editedQuestionIndex];
    // console.log("id", id);
    // const value = {
    //   id,
    // };
    setDeleteId(id);
    // deleteQuizData(value)
    //   .then((data) => {
    //     console.log("message--->", data);
    //     getQuestionList();
    //   })
    //   .catch((err) => {
    //     console.log("errr-> ", err);
    //   });
  };

  useEffect(() => {
    if (deleteId > 0) {
      setShowModal(true);
    }
  }, [deleteId]);

  useEffect(() => {
    if (localStorage.getItem("isEdited")) {
      toast.success("Question data has been updated successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      localStorage.removeItem("isEdited");
    } else if (localStorage.getItem("isQuestionAdded")) {
      toast.success("Question data has been added successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      localStorage.removeItem("isQuestionAdded");
    }
    if (localStorage.getItem("location")) {
      localStorage.removeItem("location");
      localStorage.removeItem("question_id");
    }

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

  const handleDelete = () => {
    const value = {
      id: deleteId,
    };
    deleteQuizData(value)
      .then((data) => {
        getQuestionList();
        setShowModal(false);
        getQuestionList({ page: questionList.currentPage });
        setDeleteId(0);
      })
      .catch((err) => {
        console.log("errr-> ", err);
      });
  };
  const handleToggleDeleteModal = (state) => {
    setShowModal(state);
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
      return questionList?.data?.length ? (
        questionList.data.map((user, i) => {
          return (
            <tr key={i + 1} id={`table_row_${i + 1}`}>
              <td>
                {" "}
                {(questionList.currentPage - 1) * pageData.limit + i + 1}
              </td>
              <td>{user.type}</td>
              <td>{user.questions}</td>
              <td>{user.order_id}</td>
              <td className={styles.button_wrapper}>
                <div>
                  <button
                    style={{
                      background: "transparent",
                      fontSize: "1.3rem",
                    }}
                    onClick={(e) => handleQuestionEdit(e, i + 1)}
                  >
                    <RiEdit2Fill
                    // width={200}
                    />
                  </button>
                  <button
                    style={{
                      background: "transparent",
                      fontSize: "1.3rem",
                    }}
                    onClick={(e) => handleQuestionDelete(e, i + 1)}
                  >
                    <RiDeleteBin2Fill />
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
  const handleSearch = (event) => {
    const { value } = event.target;
    getQuestionList({ search: value.trim() });
  };
  const convertDatetime = (datetime) => {
    let date = new Date(datetime).toLocaleDateString("en-GB");
    // let hours = new Date(datetime).toLocaleTimeString();
    // return `${date} ${hours}`;
    return `${date}`;
  };
  return (
    <Layout>
      <main className="main-body">
        <div className="content">
          <div className="row flex-fill justify-content-between">
            <div className="col-md-12">
              <div>
                <div
                  style={{ background: "#F5F5F5" }}
                  className={`${styles.list_wrapper} row mt-4`}
                >
                  <div className={`col-md-12 col-lg-6 col-xl-4`}>
                    <div>
                      <a href="">
                        <div className="card_dash mb-3">
                          <div className="cardinfo">
                            <label>Questionnaire</label>
                            <strong>{totalQuestons}</strong>
                          </div>
                          <div className="cardIcon">
                            <img src={questionListSvg} alt="icon" />
                          </div>
                        </div>
                      </a>
                    </div>

                    
                  </div>
                  <div className="col-md-12">
                      <hr />
                    </div>
                  <div>
                    <div className="col-md-12" >
                      <div className={`${styles.filterSection} row`}>
                        <div className="col-md-6">
                          <a
                            href="/add-question"
                            className={styles.add_question}
                          >
                            Add Question
                          </a>
                        </div>
                        <div className="col-md-3"></div>
                        <div className="col-md-6 align-self-end mb-3">
                          <div className={`${styles.serachbar}`}>
                            <input
                              type="search"
                              className={`form-control`}
                              // className= {`${styles.form_control} ${styles.search_input}`}
                              placeholder="Search"
                              onChange={handleSearch}
                              maxLength={12}
                            />
                          </div>
                        </div>

                        {/* <div className="col-md-3">
                  <JsonToExcelConverter jsonData={[]} convertDatetime={convertDatetime}/>
                </div> */}
                      </div>
                    </div>
                  </div>
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
                      <tbody>
                        {questionList.data?.length > 0 && getList()}
                      </tbody>
                    </table>
                  </div>

                  <Pagination
                    totalItems={questionList.totalItems}
                    currentPage={questionList.currentPage}
                    totalPages={questionList.totalPages}
                    getData={getQuestionList}
                    limit={pageData.limit}
                    loading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showModal === true && (
        <DeleteModal
          showModal={showModal}
          handleToggleDeleteModal={handleToggleDeleteModal}
          handleDelete={handleDelete}
          module={"Question"}
          setDeleteId={setDeleteId}
        />
      )}
    </Layout>
  );
};

export default QuestionList;

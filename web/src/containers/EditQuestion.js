import Layout from "components/Layout";
import userSvg from "assets/images/users.svg";
import eventSvg from "assets/images/events.svg";
import { useContext, useEffect, useState } from "react";
import { getDashboard } from "lib/network/apis";
import Loader from "components/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./Users.module.css";
import TextField from "components/InputFields/TextField";
import { AdminContext } from "lib/contexts/adminContext";
import {
  editQuestionData,
  getSingleQuestionData,
  quizDataAdd,
} from "lib/network/loginauth";
import addIcon from "assets/images/add_icon.svg";
import { GrSubtractCircle } from "react-icons/gr";
import { GrAddCircle } from "react-icons/gr";
import { QuestionContext } from "lib/contexts/questionContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {  IoAddCircle} from "react-icons/io5"
export default function Dashboard() {
  const navigate = useNavigate();
  const {
    questionId,
    data,
    setData,
    prevOptAlphabet,
    setOptionAlphabet,
    validationSchema,
    setValidationSchema,
    initialValues,
    setInitialValues,
    option,
    setOptions,
    correctAnswerOption,
    setCorrectAnswerOption,
  } = useContext(QuestionContext);
  // const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  // const [option, setOptions] = useState(null);
  // const [prevOptAlphabet, setOptionAlphabet] = useState(["A", "B"]);
  const [selectedOption, setSelectedOption] = useState("");
  const [deleteOptionId, setDeleteOptionId] = useState("");
  const [initialValues1, setInitialValues1] = useState(initialValues);
  const [buttonType, setButtonType] = useState("");
  const [lastIndex, setLastIndex] = useState(0);
  const [validationSchema1, setValidationSchema1] = useState(validationSchema);
  const formik = useFormik({
    initialValues: initialValues1,
    validationSchema: Yup.object(validationSchema1),
    onSubmit: (values, { resetForm }) => {
      console.log("valuesss--->", values, data["question_id"]);
      values["id"] = data["question_id"];
      values["answer_id"] = data["answer_id"];
      values["correct_option"] = data["correct_option"];
      values["options"] = data["options"];
      console.log('------------------------>',prevOptAlphabet.length);
      values['option_length'] = prevOptAlphabet.length
      resetForm({ values: "" });
      handleResetNameField();
      editQuestionData(values)
        .then((data) => {
          setOptions(null);
          console.log("dataaaaa", data.message);
          resetForm({ values: "" });
          localStorage.setItem('isEdited','yes')
          navigate("/quiz-list");
        })
        .catch((err) => console.log(err));
    },
  });

  const getEditQuestionData = async () => {
    const value = {
      id: questionId,
    };
    return getSingleQuestionData(value)
      .then((data) => {
        let result = {};
        let opts = {};
        // Iterate through the data array
        for (const item of data.data.data) {
          //   console.log("itemmm", item.option_id);
          Object.keys(item).map((vals, i) => {
            const optionId = item.option_id;
            const options = item.options;
            if (vals == "option_id" || vals == "options") {
              // Check if the optionId already exists in the result object
              if (result.hasOwnProperty("options")) {
                // Append the options to the existing array
                // result[vals].push(item[vals]);
                if (!opts.hasOwnProperty(opts[item["option_id"]])) {
                  opts[item["option_id"]] = item["options"];
                  result["options"] = opts;
                }
              } else {
                // Create a new array for the optionId and add the options
                // result[vals] = [item[vals]];
                if (vals == "option_id") {
                  opts[item["option_id"]] = item["options"];
                  result["options"] = opts;
                }
              }
            } else {
              if (vals == "answer_id") {
                result[vals] = item[vals];
              } else {
                result[vals] = item[vals];
              }
            }
          });
        }

        setOptions(Object.keys(result["options"]).length);
        let TempArr = [...prevOptAlphabet];
        if (Object.keys(result["options"]).length > TempArr.length) {
          for (let i = 3; i < Object.keys(result["options"]).length + 1; i++) {
            const charCode = TempArr[TempArr.length - 1].charCodeAt(0);
            const currentAlphabet = String.fromCharCode(charCode + 1);
            TempArr.push(currentAlphabet);
          }
        }
        setLastIndex(TempArr.length - 1);
        setOptionAlphabet([...TempArr]);
        Object.keys(result["options"]).map((opt, i) => {
          if (opt == result["answer_id"]) {
            const charCode = TempArr[i].charCodeAt(0);
            const currentAlphabet = String.fromCharCode(charCode);
            result["correct_option"] = currentAlphabet;
          }
        });
        setData(result);
        console.log(">>>>", result);
      })
      .catch((err) => console.log("------->", err));
  };
  useEffect(() => {
    // 'location','edit_quiz'
    if(! localStorage.getItem('location')){
      navigate('/quiz-list')
    }
    getEditQuestionData();
  }, []);

  const handleInitialOptions = () => {
    let updatedInitialValues = {};
    let updatedValidationSchema = {};
    Object.keys(data).map((val, i) => {
      if (val == "options") {
        prevOptAlphabet.map((opt, i) => {
          updatedInitialValues[`option${opt}`] = data["options"][i + 1]; // Add the new key-value pair

          updatedValidationSchema[`option${opt}`] =
            Yup.string().required(`Please enter option`);
        });
      } else {
        if (val == "questions") {
          updatedInitialValues["question"] = data[val];
        } else if (val == "answer_id") {
          updatedInitialValues["selectField"] = prevOptAlphabet[data[val] - 1];
          data["selectedField"] = prevOptAlphabet[data[val] - 1];

          // updatedInitialValues['selectField'] = data[val];
        }
      }
    });

    setInitialValues(updatedInitialValues);
    setValidationSchema(updatedValidationSchema);
  };
  useEffect(() => {
    if (option > 0) {
      handleInitialOptions();
    }
  }, [data, option, prevOptAlphabet, lastIndex]);

  const handleOptionNumber = () => {
    setButtonType("add");
    const charCode = prevOptAlphabet[prevOptAlphabet.length - 1].charCodeAt(0);
    const currentAlphabet = String.fromCharCode(charCode + 1);
    setOptionAlphabet((prev) => [...prev, currentAlphabet]);
    setLastIndex(prevOptAlphabet.length);
    const updatedInitialValues = {
      ...initialValues, // Spread the existing state
      [`option${currentAlphabet}`]: "", // Add the new key-value pair
    };
    setInitialValues(updatedInitialValues);
    const updatedValidationSchema = {
      ...validationSchema,
      [`option${currentAlphabet}`]:
        Yup.string().required(`Please enter option`),
    };
    setValidationSchema(updatedValidationSchema);
  };

  const handleAddOptionButtonCLick = () => {
    // if (option == lastIndex) {
    return (
      <div
        className={`col-md-12 ${styles.list_box_wrapper}`}
        id={`remove_${prevOptAlphabet[lastIndex]}`}
      >
        <span onClick={() => handleDeleteOption(prevOptAlphabet[lastIndex])}>
          <GrSubtractCircle />
        </span>
        <TextField
          name={`option${prevOptAlphabet[lastIndex]}`}
          showIcon={false}
          placeholder={`option`}
          formik={formik}
          // onBlur={formik.handleBlur}
          label={`${prevOptAlphabet[lastIndex]}`}
        />
      </div>
    );
    // } else {
    //   return prevOptAlphabet.map((alphabet, index) => {
    //     console.log("***************", index, lastIndex);
    //     if (index > option - 1) {
    //       if (index == prevOptAlphabet.length - 1) {
    //         return (
    //           <div
    //             className={`col-md-12 ${styles.list_box_wrapper}`}
    //             id={`remove_${alphabet}`}
    //           >
    //             <span onClick={() => handleDeleteOption(alphabet)}>
    //               <GrSubtractCircle />
    //             </span>
    //             <TextField
    //               name={`option${alphabet}`}
    //               showIcon={false}
    //               placeholder={`option`}
    //               formik={formik}
    //               // onBlur={formik.handleBlur}
    //               label={`${alphabet}`}
    //             />
    //           </div>
    //         );
    //       } else {
    //         return (
    //           <div
    //             className={`col-md-12 ${styles.list_box_wrapper}`}
    //             id={`remove_${alphabet}`}
    //           >
    //             <TextField
    //               name={`option${alphabet}`}
    //               showIcon={false}
    //               placeholder={`option`}
    //               formik={formik}
    //               // onBlur={formik.handleBlur}
    //               label={`${alphabet}`}
    //             />
    //           </div>
    //         );
    //       }
    //     }
    //   });
    // }
  };

  const handleDeleteOption = (alphabet) => {
    setButtonType("delete");
    setDeleteOptionId(alphabet);
    // if (prevOptAlphabet.length <= option) {
    let updatedOptionArray = prevOptAlphabet;
    const lastAlphabet = updatedOptionArray.pop();
    setOptionAlphabet((prev) => [...updatedOptionArray]);
    setLastIndex(updatedOptionArray.length - 1);
    const charCode = alphabet.charCodeAt(0);
    const updatedInitialValues = initialValues;
    const updatedValidationSchema = validationSchema;
    delete updatedInitialValues[`option${lastAlphabet}`];
    delete updatedValidationSchema[`option${lastAlphabet}`];
    setInitialValues1(updatedInitialValues);
    setValidationSchema1(updatedValidationSchema);
    setOptions(option - 1);
    let del_id = Object.keys(data["options"]);
    const val = del_id[del_id.length - 1];
    let updateData = { ...data };
    // delete updateData["options"][val];
    setData({ ...updateData });
  };

  const handleResetNameField = () => {
    // console.log("initialValues******", initialValues);
    Object.keys(initialValues).map((opt, index) => {
      if (opt.includes("option")) {
        formik.setFieldValue(opt, "");
      }
    });
  };

  return (
    <Layout>
      <main className="main-body">
        <div className="content">
          <div className="row flex-fill justify-content-between">
            <div className="col-md-12">
              <div className="white-box ">
                <div className="row mt-4">
                  <div>
                    {Object.keys(data).length > 0 && (
                      <form onSubmit={formik.handleSubmit}>
                        <div className="row g-3">
                          <div className="col-md-12">
                            <div>
                              <label htmlFor="question" className="form-label">
                                Question
                              </label>
                              <textarea
                                id="question"
                                name="question"
                                rows="4"
                                cols="50"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                  formik.values.question
                                    ? formik.values.question
                                    : (formik.values.question =
                                        data["questions"])
                                }
                                className="form-control"
                              />
                              {formik.touched.question &&
                              formik.errors.question ? (
                                <div className="error">
                                  {formik.errors.question}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          {prevOptAlphabet?.map((opt, i) => {
                            let a = Object.keys(data["options"]);
                            let currOpt = a[i];
                            if (i < lastIndex || i<2) {
                              return (
                                <div className="col-md-12">
                                  <TextField
                                    name={`option${prevOptAlphabet[i]}`}
                                    showIcon={false}
                                    placeholder={`option`}
                                    formik={formik}
                                    val={data["options"][currOpt]}
                                    // onBlur={formik.handleBlur}
                                    label={`${prevOptAlphabet[i]}`}
                                  />
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  className={`col-md-12 ${styles.list_box_wrapper}`}
                                  id={`remove_${prevOptAlphabet[i]}`}
                                >
                                  <span
                                    onClick={() =>
                                      handleDeleteOption(prevOptAlphabet[i])
                                    }
                                  >
                                    <GrSubtractCircle />
                                  </span>
                                  <TextField
                                    name={`option${prevOptAlphabet[i]}`}
                                    showIcon={false}
                                    placeholder={`option`}
                                    formik={formik}
                                    val={
                                      data["options"][currOpt]
                                        ? data["options"][currOpt]
                                        : ""
                                    }
                                    // onBlur={formik.handleBlur}
                                    label={`${prevOptAlphabet[i]}`}
                                  />
                                </div>
                              );
                            }
                          })}

                          {/* {prevOptAlphabet.length > lastIndex &&
                            handleAddOptionButtonCLick()} */}
                          {/* <button
                            onClick={handleOptionNumber}
                            style={{
                              width: "fit-content",
                              background: "#c5c6d0",
                              border: "none",
                              borderRadius: "6px",
                              color: "white",
                            }}
                            type="button"
                            id="add"
                          >
                            <GrAddCircle />
                          </button> */}

                          <button
                          onClick={handleOptionNumber}
                          style={{
                            width: "fit-content",
                            background: "transparent",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: '1.8rem',
                            marginTop: '0px'
                          }}
                          type="button"
                          id="add"
                        > 
                          <IoAddCircle />
                        </button>

                          <div className="col-md-12">
                            <label htmlFor="selectField" className="form-label">
                              Select an option:
                            </label>
                            <select
                              id="selectField"
                              value={
                                formik.values.selectField
                                  ? formik.values.selectField
                                  : (formik.values.selectField =
                                      correctAnswerOption)
                              }
                              // onChange={handleSelectChange}
                              onChange={formik.handleChange}
                              className="form-control"
                              name="selectField"
                            >
                              <option value="">Select an option</option>
                              {prevOptAlphabet.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            {/* {formik.touched.selectField &&
                            formik.errors.selectField ? (
                              <div className="error">
                                {formik.errors.selectField}
                              </div>
                            ) : null} */}
                          </div>

                          <div
                            className={`col-md-12 pt-2 ${styles.question_submit}`}
                          >
                            <button
                              className="btn btn-primary text-center"
                              type="submit"
                              styles={{ background: "#E60200" }}
                              // disabled={loading}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

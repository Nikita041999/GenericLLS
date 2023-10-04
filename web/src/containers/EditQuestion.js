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
import { IoAddCircle } from "react-icons/io5";
import { useLocation } from "react-router-dom";
export default function Dashboard() {
  const navigate = useNavigate();
  // const {
  //   questionId,
  // } = useContext(QuestionContext);
  // const [data, setData] = useState({});
  // const [isLoading, setLoading] = useState(false);
  // const [option, setOptions] = useState(null);
  // const [prevOptAlphabet, setOptionAlphabet] = useState(["A", "B"]);
  // const [selectedOption, setSelectedOption] = useState("");
  // const [deleteOptionId, setDeleteOptionId] = useState("");
  // const [initialValues, setInitialValues1] = useState(initialValues);
  const [questionId, setQuestionId] = useState(0);
  const [prevOptAlphabet, setOptionAlphabet] = useState(["A", "B"]);
  const [validationSchema, setValidationSchema] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [data, setData] = useState({});
  const [option, setOptions] = useState(null);
  const [correctAnswerOption, setCorrectAnswerOption] = useState("");
  // const [buttonType, setButtonType] = useState("");
  const [lastIndex, setLastIndex] = useState(0);
  const location = useLocation();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: Yup.object(validationSchema),
    onSubmit: (values, { resetForm }) => {
      // console.log("valuesss--->", values, data["question_id"]);
      values["id"] = data["question_id"];
      values["answer_id"] = data["answer_id"];
      values["correct_option"] = data["correct_option"];
      values["options"] = data["options"];
      values["option_length"] = prevOptAlphabet.length;
      resetForm({ values: "" });

      handleResetNameField();
      editQuestionData(values)
        .then((data) => {
          setOptions(null);
          console.log("dataaaaa", data.message);
          resetForm({ values: "" });
          localStorage.setItem("isEdited", "yes");
          navigate("/quiz-list");
          setQuestionId(0);
          setData({});
          setInitialValues({});
          setOptions({});
          setCorrectAnswerOption({});
          setValidationSchema({});
          setOptionAlphabet(["A", "B"]);
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
        // console.log("********data from api*********", data.data.data);
        for (const item of data.data.data) {
          Object.keys(item).map((vals, i) => {
            // console.log(">>>>>valesssss****",item);
            if (vals == "option_id" || vals == "options") {
              // Check if the optionId already exists in the result object
              if (result.hasOwnProperty("options")) {
                if (!opts.hasOwnProperty(opts[item["option_id"]])) {
                  opts[item["option_id"]] = item["options"];
                  result["options"] = opts;
                }
              } else {
                // Create a new array for the optionId and add the options
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
        setOptionAlphabet([...TempArr]);
        Object.keys(result["options"]).map((opt, i) => {
          const a = result["answer_id"];
          if (parseInt(opt) == parseInt(a)) {
            const charCode = TempArr[i].charCodeAt(0);
            const currentAlphabet = String.fromCharCode(charCode);
            setCorrectAnswerOption(currentAlphabet);
            // result["correct_option"] = currentAlphabet;
          }
        });
        setData(result);
      })
      .catch((err) => console.log("------->", err));
  };
  useEffect(() => {
    const id = parseInt(location.search.split("=")[1]);
    if (localStorage.getItem("question_id") == location.search.split("=")[1]) {
      setQuestionId(id);
    } else {
      navigate("/quiz-list");
    }
    if (!localStorage.getItem("location")) {
      navigate("/quiz-list");
    }
  }, []);

  useEffect(() => {
    if (questionId > 0) {
      getEditQuestionData();
    }
  }, [questionId]);

  const handleInitialOptions = () => {
    let updatedInitialValues = {};
    let updatedValidationSchema = {};
    Object.keys(data).map((val, i) => {
      if (val == "options") {
        const tempArr = Object.keys(data["options"]);
        prevOptAlphabet.map((opt, i) => {
          updatedInitialValues[`option${opt}`] = data["options"][tempArr[i]]; // Add the new key-value pair
          const tempOpt = `option${opt}`;
          updatedValidationSchema[`option${opt}`] = Yup.string()
            .required(`Please enter option`)
            .test(
              "contains-only-spaces",
              "Option must not contain only spaces",
              (value) => {
                return !/^\s+$/.test(value);
              }
            );
        });
      } else {
        if (val == "questions") {
          updatedInitialValues["question"] = data[val];
          updatedValidationSchema[`question`] = Yup.string()
            .required(`Please enter question`)
            .test(
              "contains-only-spaces",
              "Question must not contain only spaces",
              (value) => {
                return !/^\s+$/.test(value);
              }
            );
          // formik.values.question = data[val];
        } else if (val == "answer_id") {
          updatedInitialValues["selectField"] = prevOptAlphabet[data[val] - 1];
          data["selectedField"] = prevOptAlphabet[data[val] - 1];
          updatedValidationSchema[`selectField`] = Yup.string().required(
            "Please select a correct option"
          );
          // formik.values.selectedField = prevOptAlphabet[data[val] - 1];

          // updatedInitialValues['selectField'] = data[val];
        }
      }
    });
    console.log("****updatedInitialValues**", updatedInitialValues);
    setInitialValues(updatedInitialValues);
    setValidationSchema(updatedValidationSchema);
  };
  useEffect(() => {
    if (option > 0) {
      console.log("when data updated", option, data);
      handleInitialOptions();
    }
  }, [data, option, prevOptAlphabet, lastIndex]);
  useEffect(() => {
    console.log("--initialValues1-->", initialValues);
    formik.resetForm(initialValues);
  }, [initialValues]);

  const handleOptionNumber = () => {
    // setButtonType("add");
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
  };

  const handleDeleteOption = (alphabet) => {
    let updatedOptionArray = prevOptAlphabet;
    const lastAlphabet = updatedOptionArray.pop();
    setOptionAlphabet((prev) => [...updatedOptionArray]);
    setLastIndex(updatedOptionArray.length - 1);
    const charCode = alphabet.charCodeAt(0);
    const updatedInitialValues = initialValues;
    const updatedValidationSchema = validationSchema;
    delete updatedInitialValues[`option${lastAlphabet}`];
    delete updatedValidationSchema[`option${lastAlphabet}`];
    setInitialValues(updatedInitialValues);
    setValidationSchema(updatedValidationSchema);
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
                                autoComplete="off"
                                value={formik.values.question}
                                // onClick={handleQuestionResetForm}
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
            
                            if (i < lastIndex || i < 2) {
                              return (
                                <div className="col-md-12">

                                  <label
                                    htmlFor={`option${prevOptAlphabet[i]}`}
                                    className="form-label"
                                  >
                                    {`${prevOptAlphabet[i]}`}
                                  </label>
                                  <input
                                    id="question"
                                    name={`option${prevOptAlphabet[i]}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoComplete="off"
                                    value={
                                      formik.values[
                                        `option${prevOptAlphabet[i]}`
                                      ]
                                    }
                                    className="form-control"
                                  />
                                  {formik.touched[
                                    `option${prevOptAlphabet[i]}`
                                  ] &&
                                  formik.errors[
                                    `option${prevOptAlphabet[i]}`
                                  ] ? (
                                    <div className="error">
                                      {
                                        formik.errors[
                                          `option${prevOptAlphabet[i]}`
                                        ]
                                      }
                                    </div>
                                  ) : null}
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  className={`col-md-12 ${styles.list_box_wrapper}`}
                                  id={`remove_${prevOptAlphabet[i]}`}
                                >
                                  <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleDeleteOption(prevOptAlphabet[i])
                                    }
                                  >
                                    <GrSubtractCircle />
                                  </span>
                                  <label
                                    htmlFor={`option${prevOptAlphabet[i]}`}
                                    className="form-label"
                                  >
                                    {`${prevOptAlphabet[i]}`}
                                  </label>
                                  <input
                                    id="question"
                                    name={`option${prevOptAlphabet[i]}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoComplete="off"
                                    value={
                                      formik.values[
                                        `option${prevOptAlphabet[i]}`
                                      ]
                                    }
                                    className="form-control"
                                  />
                                  {formik.touched[
                                    `option${prevOptAlphabet[i]}`
                                  ] &&
                                  formik.errors[
                                    `option${prevOptAlphabet[i]}`
                                  ] ? (
                                    <div className="error">
                                      {
                                        formik.errors[
                                          `option${prevOptAlphabet[i]}`
                                        ]
                                      }
                                    </div>
                                  ) : null}
                                </div>
                              );
                            }
                          })}

                          <button
                            onClick={handleOptionNumber}
                            style={{
                              width: "fit-content",
                              background: "transparent",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "1.8rem",
                              marginTop: "0px",
                            }}
                            type="button"
                            id="add"
                          >
                            <IoAddCircle />
                          </button>

                          <div className="col-md-12">
                            <label htmlFor="selectField" className="form-label">
                              Select a correct option:
                            </label>
                            <select
                              id="selectField"
                              autoComplete="off"
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
                              style={{ cursor: "pointer" }}
                            >
                              <option value="">Select an option</option>
                              {prevOptAlphabet.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            {formik.touched.selectField &&
                            formik.errors.selectField ? (
                              <div className="error">
                                {formik.errors.selectField}
                              </div>
                            ) : null}
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

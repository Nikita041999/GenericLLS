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
import { editQuizData, quizDataAdd } from "lib/network/loginauth";
import addIcon from "assets/images/add_icon.svg";
import { GrSubtractCircle } from "react-icons/gr";
import { GrAddCircle } from "react-icons/gr";
import { QuestionContext } from "lib/contexts/questionContext";
export default function Dashboard() {
  const { questionId } = useContext(QuestionContext);
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [option, setOptions] = useState(null);
  const [prevOptAlphabet, setOptionAlphabet] = useState(["A", "B"]);
  const [selectedOption, setSelectedOption] = useState("");
  const [deleteOptionId, setDeleteOptionId] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [buttonType, setButtonType] = useState("");
  const [validationSchema, setValidationSchema] = useState({});
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationSchema),
    onSubmit: (values, { resetForm }) => {
      resetForm({ values: "" });
      handleResetNameField();
      quizDataAdd(values)
        .then((data) => {
          setOptions(null);
          resetForm({ values: "" });
        })
        .catch((err) => console.log(err));
    },
  });

  const getEditQuestionData = async () => {
    const value = {
      id: questionId,
    };
    return editQuizData(value)
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
                // const charCode = "A".charCodeAt(0);
                // const currentAlphabet = String.fromCharCode(
                //   charCode + item[vals]
                // );
                // console.log('-->',currentAlphabet);
                result[vals] = "A";
              } else {
                result[vals] = item[vals];
              }
            }
          });
        }
        // console.log(">>>>", result);
        setData(result);

        setOptions(Object.keys(result["options"]).length);
        let TempArr = [...prevOptAlphabet];
        if (Object.keys(result["options"]).length > TempArr.length) {
          for (let i = 3; i < Object.keys(result["options"]).length + 1; i++) {
            const charCode = TempArr[TempArr.length - 1].charCodeAt(0);
            // console.log("charCode****", charCode);
            const currentAlphabet = String.fromCharCode(charCode + 1);
            TempArr.push(currentAlphabet);
          }
        }
        setOptionAlphabet([...TempArr]);
      })
      .catch((err) => console.log("------->", err));
  };
  useEffect(() => {
    getEditQuestionData();
  }, []);

  const handleInitialOptions = () => {
    let updatedInitialValues = {};
    let updatedValidationSchema = {};
    Object.keys(data).map((val, i) => {
      if (val == "options") {
        prevOptAlphabet.map((opt, i) => {
          //   console.log("****opt", opt, data["options"][i + 1]);
          updatedInitialValues[`option${opt}`] = data["options"][i + 1]; // Add the new key-value pair

          updatedValidationSchema[`option${opt}`] =
            Yup.string().required(`Please enter option`);
          //   console.log(
          //     "************************",
          //     updatedInitialValues,
          //     updatedValidationSchema
          //   );
        });
      } else {
        if (val == "questions") {
          updatedInitialValues["question"] = data[val];
        } else if (val == "answer_id") {
          updatedInitialValues["selectField"] = prevOptAlphabet[data[val] - 1];
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

  }, [data, option, prevOptAlphabet]);

  const handleOptionNumber = () => {
    setButtonType("add");
    const charCode = prevOptAlphabet[prevOptAlphabet.length - 1].charCodeAt(0);
    const currentAlphabet = String.fromCharCode(charCode + 1);
    setOptionAlphabet((prev) => [...prev, currentAlphabet]);

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

  const handleDeleteOption = (alphabet) => {
    setButtonType("delete");
    setDeleteOptionId(alphabet);
    let updatedOptionArray = prevOptAlphabet;
    const lastAlphabet = updatedOptionArray.pop();
    setOptionAlphabet((prev) => [...updatedOptionArray]);
    const charCode = alphabet.charCodeAt(0);
    const updatedInitialValues = initialValues;
    const updatedValidationSchema = validationSchema;
    delete updatedInitialValues[`option${lastAlphabet}`];
    delete updatedValidationSchema[`option${lastAlphabet}`];
    setInitialValues(updatedInitialValues);
    setValidationSchema(updatedValidationSchema);
  };

  const handleAddOptionButtonCLick = () => {
    return prevOptAlphabet.map((alphabet, index) => {
      if (index > 1) {
        if (index == prevOptAlphabet.length - 1) {
          return (
            <div
              className={`col-md-12 ${styles.list_box_wrapper}`}
              id={`remove_${alphabet}`}
            >
              <span onClick={() => handleDeleteOption(alphabet)}>
                <GrSubtractCircle />
              </span>
              <TextField
                name={`option${alphabet}`}
                showIcon={false}
                placeholder={`option`}
                formik={formik}
                // onBlur={formik.handleBlur}
                label={`${alphabet}`}
              />
            </div>
          );
        } else {
          return (
            <div
              className={`col-md-12 ${styles.list_box_wrapper}`}
              id={`remove_${alphabet}`}
            >
              <TextField
                name={`option${alphabet}`}
                showIcon={false}
                placeholder={`option`}
                formik={formik}
                // onBlur={formik.handleBlur}
                label={`${alphabet}`}
              />
            </div>
          );
        }
      }
    });
  };

  const handleResetNameField = () => {
    console.log("initialValues******", initialValues);
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
                                    : data["questions"]
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

                          {option > 0 &&
                            Object.keys(data["options"])?.map((opt, i) => {
                              console.log("opttttt", opt);
                              return (
                                <div className="col-md-12">
                                  <TextField
                                    name={`option${prevOptAlphabet[i]}`}
                                    showIcon={false}
                                    placeholder={`option`}
                                    formik={formik}
                                    val={data["options"][opt]}
                                    // onBlur={formik.handleBlur}
                                    label={`${prevOptAlphabet[i]}`}
                                  />
                                </div>
                              );
                            })}

                          {prevOptAlphabet.length > option &&
                            handleAddOptionButtonCLick()}
                          <button
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
                                  : data["answer_id"]
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

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
import { quizDataAdd } from "lib/network/loginauth";
import addIcon from "assets/images/add_icon.svg";
import { GrSubtractCircle } from "react-icons/gr";
import { GrAddCircle} from "react-icons/gr"
export default function Dashboard() {
  const initialValues1 = {
    question: "",
    selectField: "",
    optionA: "",
    optionB: "",
  };
  const validationSchema1 = {
    question: Yup.string().required("Please enter question"),
    selectField: Yup.string().required("Please enter answer"),
    optionA: Yup.string().required("Please enter option A"),
    optionB: Yup.string().required("Please enter option B"),
  };
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [option, setOptions] = useState(null);
  const [prevOptAlphabet, setOptionAlphabet] = useState(["A", "B"]);
  const [selectedOption, setSelectedOption] = useState("");
  const [deleteOptionId, setDeleteOptionId] = useState("");
  const [initialValues, setInitialValues] = useState(initialValues1);
  const [buttonType, setButtonType] = useState("");
  const [validationSchema, setValidationSchema] = useState(validationSchema1);
  useEffect(() => {
    // console.log("options******", option);
  }, [option]);
  useEffect(() => {
    // setLoading(true);
    // console.log("isLoading>>>>", isLoading);
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationSchema),
    onSubmit: (values, { resetForm }) => {
      // setShowError(false);
      // setLoading(true);
      console.log(values);
      resetForm({ values: "" });

      handleResetNameField();
      console.log(values);
      quizDataAdd(values)
        .then((data) => {
          console.log("data------>", data);
          setOptions(null);
          resetForm({ values: "" });
        })
        .catch((err) => console.log(err));
      console.log("***************** inside login fn 2", values);
    },
  });

  const handleOptionNumber = () => {
    setButtonType("add");
    const charCode = prevOptAlphabet[prevOptAlphabet.length - 1].charCodeAt(0);
    // console.log("charCode****", charCode);
    const currentAlphabet = String.fromCharCode(charCode + 1);
    setOptionAlphabet((prev) => [...prev, currentAlphabet]);
    // console.log("dgjdsig", initialValues);

    const updatedInitialValues = {
      ...initialValues, // Spread the existing state
      // ...initialValues1,
      [`option${currentAlphabet}`]: "", // Add the new key-value pair
    };
    setInitialValues(updatedInitialValues);
    const updatedValidationSchema = {
      ...validationSchema,
      // ...validationSchema1,
      [`option${currentAlphabet}`]: Yup.string().required(
        `Please enter option ${prevOptAlphabet[prevOptAlphabet.length - 1]},`
      ),
    };
    setValidationSchema(updatedValidationSchema);
  };

  const handleDeleteOption = (alphabet) => {
    console.log("*****", alphabet);
    setButtonType("delete");
    setDeleteOptionId(alphabet);
    let updatedOptionArray = prevOptAlphabet;
    // const updatedOptionArray = prevOptAlphabet.filter(
    //   (element, index) => element != alphabet
    // );
    console.log(">>>>>>>updatedOptionArray", updatedOptionArray);
    const lastAlphabet = updatedOptionArray.pop();
    // const lastAlphabet = prevOptAlphabet[prevOptAlphabet.length - 1];
    // updatedOptionArray.pop();
    console.log("-----updated array", updatedOptionArray, alphabet);
    setOptionAlphabet((prev) => [...updatedOptionArray]);
    const charCode = alphabet.charCodeAt(0);
    const currentAlphabet = String.fromCharCode(charCode + 1);
    const tempInitialVals = {};
    const tempValidationVals = {};
    const updatedInitialValues = initialValues;
    const updatedValidationSchema = validationSchema;
    delete updatedInitialValues[`option${lastAlphabet}`];
    delete updatedValidationSchema[`option${lastAlphabet}`];
    setInitialValues(updatedInitialValues);
    setValidationSchema(updatedValidationSchema);

    // const updatedInitialValues = {
    //   ...initialValues,
    //   [`option${currentAlphabet}`]: "",
    // };
    // setInitialValues(updatedInitialValues);
    // const updatedValidationSchema = {
    //   ...validationSchema,
    //   [`option${currentAlphabet}`]: Yup.string().required(
    //     `Please enter option ${prevOptAlphabet[prevOptAlphabet.length - 1]},`
    //   ),
    // };
    // setValidationSchema(updatedValidationSchema);
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
  const handleDeleteOptionButtonCLick = () => {
    let charCode = deleteOptionId.charCodeAt(0);
    return prevOptAlphabet.map((alphabet, index) => {
      let alphaCharCode = alphabet.charCodeAt(0);
      if (index > 1) {
        if (index == prevOptAlphabet.length - 1) {
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
                label={`${alphabet}`}
              />
            </div>
          );
        } else {
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
              label={`${alphabet}`}
            />
          </div>;
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
    // formik.setFieldValue("optionC", "");
  };
  useEffect(() => {
    console.log("***initialValues**", prevOptAlphabet);
    console.log(">>>initialValues>>", initialValues);
    console.log(")))))))validationSchema>>>>>>>>", validationSchema);

    console.log("buttonType---->", buttonType);
    // if (buttonType == "add") {
    //   handleAddOptionButtonCLick();
    // }
    // if (buttonType == "delete") {
    //   handleDeleteOptionButtonCLick();
    // }
  }, [
    prevOptAlphabet,
    initialValues,
    validationSchema,
    buttonType,
    deleteOptionId,
  ]);
  return (
    <Layout>
      <main className="main-body">
        <div className="content">
          <div className="row flex-fill justify-content-between">
            <div className="col-md-12">
              <div className="white-box ">
                {/* <h1>Welcome Admin</h1> */}

                {/* {isLoading ? (
                  <div className="row mt-4">
                    <Loader />
                  </div>
                ) : ( */}
                <div className="row mt-4">
                  <div>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="row g-3">
                        <div className="col-md-12">
                          {/* <TextField
                            name="question"
                            showIcon={false}
                            // icon={"emailSvg"}
                            placeholder="Enter your question here"
                            formik={formik}
                            label={"Question"}
                          /> */}
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
                              value={formik.values.question}
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

                        <div className="col-md-12">
                          <TextField
                            name={`optionA`}
                            showIcon={false}
                            placeholder={`option`}
                            formik={formik}
                            label={`A`}
                          />
                        </div>
                        <div className="col-md-12">
                          <TextField
                            name={`optionB`}
                            showIcon={false}
                            placeholder={`option`}
                            formik={formik}
                            // onBlur={formik.handleBlur}
                            label={`B`}
                          />
                        </div>
                        {prevOptAlphabet.length > 2 &&
                          handleAddOptionButtonCLick()}
                        <button
                          onClick={handleOptionNumber}
                          style={{
                            width: "fit-content",
                            background: "#c5c6d0",
                            border: "none",
                            borderRadius: "6px",
                            color:"white"
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
                            value={formik.values.selectField}
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
                            styles={{background:'#E60200'}}
                            // disabled={loading}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
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

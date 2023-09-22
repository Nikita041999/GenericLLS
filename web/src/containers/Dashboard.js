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
import { ImBin } from "react-icons/im";
export default function Dashboard() {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [option, setOptions] = useState(null);
  const [prevOptAlphabet, setOptionAlphabet] = useState(["A", "B"]);
  const [selectedOption, setSelectedOption] = useState("");
  const arr = [];
  useEffect(() => {
    console.log("options******", option);
  }, [option]);
  useEffect(() => {
    setLoading(true);
    console.log("isLoading>>>>", isLoading);
  }, []);

  let initialValues = {
    question: "",
    answer: "",
    optionA: "",
    optionB: "",
  };
  let validationSchema = {
    question: Yup.string().required("Please enter question"),
    answer: Yup.string().required("Please enter answer"),
    optionA: Yup.string().required("Please enter option A"),
    optionB: Yup.string().required("Please enter option B"),
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationSchema),
    onSubmit: async (values, { resetForm }) => {
      console.log(1);
      // setShowError(false);
      // setLoading(true);
      console.log(values);
      // quizDataAdd(values)
      //   .then((data) => {
      //     console.log("data------>", data);
      //     setOptions(null);
      //     resetForm();
      //   })
      //   .catch((err) => console.log(err));
      // console.log("***************** inside login fn 2", values);
    },
  });

  // const handleOptionNumber = (count) => {
  //   let arr = [];
  //   for (let i = 0; i < count; i++) {
  //     arr.push(
  //       <div className="col-md-12">
  //         <TextField
  //           name={`option${i + 1}`}
  //           showIcon={false}
  //           placeholder={`option${i + 1}`}
  //           formik={formik}
  //           // onBlur={formik.handleBlur}
  //           label={`option${i + 1}`}
  //         />
  //       </div>
  //     );

  //     initialValues[`option${i + 1}`] = "";
  //     validationSchema[`option${i + 1}`] = Yup.string().required(
  //       `Please enter option ${i + 1}`
  //     );
  //   }
  //   return arr;
  // };
  const handleOptionNumber = () => {
    let capital = true;
    // let arr = [];
    console.log(1);
    const charCode = prevOptAlphabet[prevOptAlphabet.length - 1].charCodeAt(0);
    console.log("charCode****", charCode);
    // console.log(String.fromCharCode(charCode+1));
    const currentAlphabet = String.fromCharCode(charCode + 1);
    setOptionAlphabet((prev) => [...prev, currentAlphabet]);
    console.log("dgjdsig", initialValues);
    // arr.push(
    //   <div className="col-md-12">
    //     <TextField
    //       name={`option${currentAlphabet}`}
    //       showIcon={false}
    //       placeholder={`option`}
    //       formik={formik}
    //       // onBlur={formik.handleBlur}
    //       label={`option${currentAlphabet}`}
    //     />
    //   </div>
    // );
    // initialValues[`option${currentAlphabet}`] = "";
    // validationSchema[`option${currentAlphabet}`] = Yup.string().required(
    //   `Please enter option ${currentAlphabet}`
    // );

    // return arr;
  };

  // Event handler to handle changes in the selected value
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  useEffect(() => {
    initialValues[`option${prevOptAlphabet[prevOptAlphabet.length - 1]}`] = "";
    validationSchema[`option${prevOptAlphabet[prevOptAlphabet.length - 1]},`] =
      Yup.string().required(
        `Please enter option ${prevOptAlphabet[prevOptAlphabet.length - 1]},`
      );
    console.log("***initialValues**8 ", initialValues);
  }, [prevOptAlphabet]);
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
                        {/* <div className="col-md-3">
                          <label htmlFor={"opt_number"} className="form-label">
                            {"Enter number of options"}
                          </label>
                          <input
                            name="opt_number"
                            className={"form-control col-md-3"}
                            type="number"
                            value={option}
                            onChange={(e) => setOptions(e.target.value)}
                          />
                        </div> */}
                        {/* {handleOptionNumber(option)} */}
                        <div className="col-md-12">
                          <TextField
                            name={`optionA`}
                            showIcon={false}
                            placeholder={`option`}
                            formik={formik}
                            // onBlur={formik.handleBlur}
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
                          prevOptAlphabet.map((alphabet, index) => {
                            if (index > 1) {
                              return (
                                <div className={`col-md-12 ${styles.list_box_wrapper}`}>
                                  <span>
                                    <ImBin />
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
                            }
                          })}
                        <button
                          onClick={handleOptionNumber}
                          style={{
                            width: "fit-content",
                            background: "#c5c6d0",
                            border: "none",
                            borderRadius: "6px",
                          }}
                          type="button"
                        >
                          <img src={addIcon} />
                        </button>

                        <div className="col-md-12">
                          {/* <TextField
                            name="answer"
                            showIcon={false}
                            placeholder="answer"
                            formik={formik}
                            label={"Right Option"}
                          /> */}
                          <label htmlFor="answer" className="form-label">
                            Select an option:
                          </label>
                          <select
                            id="answer"
                            value={selectedOption}
                            onChange={handleSelectChange}
                            className="form-control"
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

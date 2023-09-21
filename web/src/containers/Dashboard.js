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
export default function Dashboard() {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [option, setOptions] = useState(null);
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
  };
  let validationSchema = {
    question: Yup.string().required("Please enter question"),
    answer: Yup.string().required("Please enter answer"),
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationSchema),
    onSubmit: async (values, { resetForm }) => {
      console.log(1);
      // setShowError(false);
      // setLoading(true);
      quizDataAdd(values)
        .then((data) => {
          console.log("data------>", data);
          setOptions(null)
          resetForm();
        })
        .catch((err) => console.log(err));
      // console.log("***************** inside login fn 2", values);
    },
  });

  const handleOptionNumber = (count) => {
    let arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(
        <div className="col-md-12">
          <TextField
            name={`option${i + 1}`}
            showIcon={false}
            placeholder={`option${i + 1}`}
            formik={formik}
            // onBlur={formik.handleBlur}
            label={`option${i + 1}`}
          />
        </div>
      );

      initialValues[`option${i + 1}`] = "";
      validationSchema[`option${i + 1}`] = Yup.string().required(
        `Please enter option ${i + 1}`
      );
    }
    return arr;
  };
  return (
    <Layout>
      <main className="main-body">
        <div className="content">
          <div className="row flex-fill justify-content-between">
            <div className="col-md-12">
              <div className="white-box ">
                <h1>Welcome Admin</h1>

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
                          <TextField
                            name="question"
                            showIcon={false}
                            // icon={"emailSvg"}
                            placeholder="Enter your question here"
                            formik={formik}
                            label={"Question"}
                          />
                        </div>
                        <div className="col-md-3">
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
                        </div>
                        {handleOptionNumber(option)}
                        {option > 0 && (
                          <div className="col-md-12">
                            <TextField
                              name="answer"
                              showIcon={false}
                              placeholder="answer"
                              formik={formik}
                              label={"Right Option"}
                              // onBlur={formik.handleBlur}
                            />
                          </div>
                        )}
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

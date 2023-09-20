import Layout from "components/Layout";
import userSvg from "assets/images/users.svg";
import eventSvg from "assets/images/events.svg";
import { useEffect, useState } from "react";
import { getDashboard } from "lib/network/apis";
import Loader from "components/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./Users.module.css";
import TextField from "components/InputFields/TextField";
export default function Dashboard() {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [option, setOptions] = useState(0);
  useEffect(() => {
    console.log("options******", option);
  }, [option]);
  useEffect(() => {
    setLoading(true);
    console.log("isLoading>>>>", isLoading);
    // getDashboard()
    //   .then((dashboardRes) => {
    //    setData(dashboardRes.data.data[0]);
    //     setLoading(false);
    //   })
    //   .catch((er) => console.log("er", er));
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
    onSubmit: async (values) => {
      // setShowError(false);
      // setLoading(true);
      console.log("***************** inside login fn 2", values);

      // userStore.userLogin(values).then((res) => {
      //   if (res.status) {
      //     setLoading(false);
      //     navigate("/dashboard");
      //   } else {
      //     setShowError(res.error);
      //     setLoading(false);
      //   }
      // });
    },
  });

  const handleOptionNumber = (count) => {
    let arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(
        <div className="col-md-12">
          <TextField
            name="option"
            showIcon={false}
            placeholder="option"
            formik={formik}
            // onBlur={formik.handleBlur}
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
                  <div className="col-md-12 col-lg-6 col-xl-4">
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
                  </div>
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
                            onChange={(e) => setOptions(e.target.value)}
                          />
                        </div>
                        {handleOptionNumber(option)}
                        {option > 0 && (
                          <div className="col-md-12">
                            <TextField
                              name="password"
                              showIcon={false}
                              placeholder="Answer"
                              formik={formik}
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

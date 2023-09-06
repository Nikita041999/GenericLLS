import logo from "assets/images/trdeshowlogo.png";
import Footer from "components/Layout/Footer";
import passwordSvg from "../../src/assets/images/input-password.svg";
import emailSvg from "../../src/assets/images/input-email.svg";
import TextField from "components/InputFields/TextField";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";
import { UserContext } from "lib/contexts/userContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Loader from "components/Loader";
import { login } from "lib/network/auth";
import "../../src/assets/css/style.css";
// import styles from "../../src/components/TradeshowComps/LoginPlayer.module.css";

function Login() {
  const userStore = useContext(UserContext);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const formik = useFormik({
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter valid Email")
      .required("Please enter Email")
      .max(25, "Email can't be longer than 25 characters"),
    password: Yup.string()
      .required("Please enter Password")
      .max(20, "Password can't be longer than 20 characters"),
  });

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    // console.log(values);
    // setShowError(false);
    setLoading(true);
    userStore.userLogin(values).then((res) => {
      if (res.status) {
        // setLoading(false);
        navigate("/dashboard");
        setLoading(false);
        // window.location.href = "/users";
      } else {
        // console.log("*****res.error***", res.error);
        const errors = res;

        // && typeof errors === 'object'
        if (errors) {
          Object.keys(errors).forEach((fieldName) => {
            setFieldError("password", res.error);
          });
        }
        setShowError(res.error);
        setLoading(false);
      }
    });
  };

  return (
    <div className="outer">
      <div>
        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        )}

        <div>
          <aside className="sidebar-login">
            <div className="m-auto text-center">
              <img src={logo} alt="logo-large" width="250" />
            </div>
          </aside>

          <main className="main-body">
            <div className="content loginBoxOuterMobile">
              <div className="row pageHeight g-4">
                <div className="col-md-12 d-flex align-items-center justify-content-center">
                  <div className="outer-box">
                    <div className="outer-box-header">
                      <h1>
                        <span>Welcome!</span>Employee Admin Panel
                      </h1>
                    </div>
                    <div className="row g-3">
                      {/* {showError ? (
                      <div style={{height:'40px'}}>
                      <span className="error" >{showError}</span>
                      </div>
                    ) : (
                      ""
                    )} */}
                      <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                      >
                        <Form>
                          <div className="row justify-content-center">
                            <div className="col-md-12">
                              <div className="row gx-5">
                                <div className="col-md-12 mb-4">
                                  <i className="inputIcon">
                                    <img src={emailSvg} alt={"email icon"} />
                                  </i>
                                  <Field
                                    type="text"
                                    className={` form-control `}
                                    placeholder="E-mail Address"
                                    name={"email"}
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="error"
                                  />
                                </div>
                                <div className="col-md-12 mb-4">
                                <i className="inputIcon">
                                    <img src={passwordSvg} alt={"password icon"} />
                                  </i>
                                  <Field
                                    type="password"
                                    className={` form-control `}
                                    placeholder="Password"
                                    name={"password"}
                                    
                                  />
                                  <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="error"
                                  />
                                </div>
                              </div>
                              <button
                                className="btn btn-primary w-100 text-center"
                                type="submit"
                              >
                                Login
                              </button>
                            </div>
                          </div>
                        </Form>
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Login;

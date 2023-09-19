import React, { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { UserContext } from "lib/contexts/userContext";
import * as Yup from "yup";
import TopRowImg from "assets/images/top-row-img.svg";
import styles from "./LoginPlayer.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const[statusCheck,setStatusCheck] = useState(false)
  const userStore = useContext(UserContext);
  const navigate = useNavigate()
  const initialValues = {
    email: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Please enter valid Email.")
      .required("Email is required.")
      .max(50, "Email must be at most 50 characters"),
  });

  const handleSubmit = (values) => {
    userStore.userForgetPassword(values).then((res) => {
      if (res.message) {
        setShowError(true);
        setStatusCheck(res.status)
        setError(res.message);
      } else {
        const errors = res.error;
        if (errors) {
          setShowError(true);
          setStatusCheck(res.status)
          setError(errors);
        }
      }
    });
  };

  useEffect(() => {
    if (showError == true) {
      //   toast(error, { type: "error" });
      if(statusCheck==false){
        toast.error(error, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }else{
        toast.success(error, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
    setShowError(false);
    if (error.length > 0) {
      navigate('/')
      // setTimeout(() => {
      //   navigate("/");
      // }, 3000);
    }
  }, [showError,error]);

  return (
    <div className={styles.loginPage}>
      <div className="top-hor-img">
        <img src={TopRowImg} className="w-100" />
      </div>
    <div className={`${styles.container_fluid_login}`}>
      <h2 style={{alignSelf: "center"}}>Forgot your password?</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <div className="col-md-12 mb-3">
            <Field
              autoComplete="off"
              type="text"
              className={`${styles.loginformfields} form-control `}
              placeholder="E-mail Address"
              name={"email"}
            />
            <ErrorMessage name="email" component="div" className="error" />
            <div
              className={`mt-3 ${styles.text_end} mt-3`}
            >
            <a style={{alignSelf:'end',fontWeight:500}} className={`${styles.back_to_login}`} href="/">Back to Login</a>
              <button className={`${styles.red_btn}`} type="submit" style={{marginRight:"1rem"}}>
                {" "}
                Submit{" "}
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
    </div>
  );
};

export default ForgetPassword;

import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "lib/contexts/userContext";
import styles from "./LoginPlayer.module.css";
import * as Yup from "yup";
import { toast } from "react-toastify";
import TopRowImg from "assets/images/top-row-img.svg";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const[statusCheck,setStatusCheck] = useState(false)
  const navigate = useNavigate();
  const userStore = useContext(UserContext);
  const initialValues = {
    password: "",
    confirmPassword: "",
  };
  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required.")
      .min(6, "Password must be at least 8 characters long.")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match.")
      .required("Confirm Password is required")
      .min(6, "Password must be at least 8 characters long.")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
  });
  const handleSubmit = (values) => {
    console.log("valuessss", values);
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const { password, confirmPassword } = values;
    // Get the 'token' parameter value
    const data = {
      password,
      confirmPassword,
      token,
    };
    if (token) {
      console.log(token);
      userStore.userChangePassword(data).then((res) => {
        if (res.message) {
          setShowError(true);
          setError(res.message);
          setStatusCheck(res.status)
        } else {
          const errors = res.error;
          if (errors) {
            setShowError(true);
            setError(errors);
            setStatusCheck(res.status)
          }
        }
      });
    }
  };
  // useEffect(() => {
  //   const tokenn = JSON.parse(localStorage.getItem("user"));
  //   if (tokenn) {
  //     navigate("/");
  //   }
  // },[])
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
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [showError, error]);

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);

  //   // Get the 'token' parameter value
  //   const token = params.get('token');

  //   if (token) {
  //     console.log(token);
  //     // Do something with the 'token' value
  //   }
  // },[])
  return (
    <div className={styles.loginPage}>
    <div className="top-hor-img">
      <img src={TopRowImg} className="w-100" />
    </div>
    <div className={`${styles.container_fluid_login}`}>
      <h2 style={{alignSelf: "center", margin:"1rem 0"}}>Reset you passwrod</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <div className="col-md-12 mb-3">
            {" "}
            <Field
              autoComplete="off"
              type="password"
              className={`${styles.loginformfields} form-control `}
              placeholder="Passwrod"
              name={"password"}
            />
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          <div className="col-md-12 mb-3">
            {" "}
            <Field
              autoComplete="off"
              type="password"
              className={`${styles.loginformfields} form-control `}
              placeholder="Confirm Password"
              name={"confirmPassword"}
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="error"
            />
          </div>
          <div
            className={`mt-3 ${styles.text_end} mt-3`}
          >
            <button className={`${styles.red_btn}`} type="submit">
              {" "}
              Submit{" "}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
    </div>
  );
};

export default ChangePassword;

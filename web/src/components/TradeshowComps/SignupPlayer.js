import React, { useState, useEffect, useReducer, useRef, useContext } from "react";
// import { Formik, useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import TextField from "../InputFields/TextField";
import TopRowImg from "assets/images/top-row-img.svg";
import WhiteArrow from "assets/images/white-arrow.svg";
import styles from "./LoginPlayer.module.css";
import audioFile from "../../assets/sounds/Quiz_NotPlaying.mp3";
// import { userRegister } from "../../lib/network/loginauth";
import { usePlayerContext } from "lib/contexts/playerContext";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { UserContext } from "lib/contexts/userContext";
// import styles from "./StartPage.module.css";

const SignupPlayer = () => {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [audio, SetAudio] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const navigate = useNavigate();
  const userStore = useContext(UserContext)
  // const audioRef = useRef(null);

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    institute: "",
    city: "",
    country: "",
    password: "",
    terms: false,
  };
  const validationSchema = Yup.object({
    firstname: Yup.string()
      .trim()
      .matches(/^[A-Za-z ]*$/, "Please enter valid FirstName.")
      .max(20)
      .required("First name is required.")
      .max(20, "First name must be at most 20 characters."),
    // .required("Please enter valid FirstName"),
    lastname: Yup.string()
      .trim()
      .matches(/^[A-Za-z ]*$/, "Please enter valid LastName.")
      .max(20)
      .required("Last name is required.")
      .max(20, "Last name must be at most 20 characters."),
    // .required("Please enter valid LastName"),
    email: Yup.string()
      .trim()
      .email("Please enter valid Email.")
      .required("Email is required.")
      .max(50, "Email must be at most 50 characters."),
    institute: Yup.string()
      .trim()
      .required("Please enter Hospital/Institution.")
      .matches(/^[a-zA-Z\s-]+$/, "Please enter valid Hospital/Institution.")
      .max(30, "Hospital/Institution must be at most 30 characters."),
    city: Yup.string()
      .trim()
      .required("City is required.")
      .matches(/^[a-zA-Z\s-]+$/, "Please Enter valid city name.")
      .max(50, "City must be at most 50 characters."),
    country: Yup.string()
      .trim()
      .required("Country is required.")
      .matches(/^[a-zA-Z\s-]+$/, "Please Enter valid country name.")
      .max(50, "Country must be at most 50 characters."),
    password: Yup.string()
      .required("Password is required.")
      .min(6, "Password must be at least 8 characters long.")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    terms: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions to continue.")
      .required("You must accept the terms and conditions to continue.")
      
  });

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("player"));
    if (token) {
      navigate("/introduction");
    }
    SetAudio(new Audio(audioFile));
  }, []);
  useEffect(() => {
    if (showError == true) {
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
    }
    setShowError(false);
  }, [showError]);

  const handleSubmit = (values, { setSubmitting, setFieldError }) => {
    console.log(1);
    setLoading(true);
    setShowError(false);
    addPlayerData(values).then((res) => {
      if (res.data != undefined && res.data.length == 1) {
        setLoading(false);
        window.sessionStorage.setItem(
          "player",
          JSON.stringify(res.data[0])
        );
        navigate(`/introduction`);
        // window.location.href = "/users";
      }  else if (res.data.length == 0) {
        setShowError(true);
        setError(res.message);
        setLoading(false);
      }else {
        const errors = res.error;
        if (errors) {
          setShowError(true);
          setError(errors);
        }
        setLoading(false);
      }
    });
  };

  const addPlayerData = async (values) => {
    return userStore.userRegister(values)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        // console.log(err);
        return err;
      });
  };

  return (
    <div className={styles.loginPage}>
      <div className="top-hor-img">
        <img src={TopRowImg} className="w-100" />
      </div>
      <div className={`${styles.container_fluid_login}`}>
        <h2 style={{alignSelf: "center", margin:"1rem 0"}}>SIGN UP</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <div className="row justify-content-center">
              <div className="col-md-9">
                <div className="row gx-5">
                  <div className="col-md-6 mb-3">
                    <Field
                      autoComplete="off"
                      type="text"
                      className={`form-control  ${styles.loginformfields}`}
                      placeholder="First Name"
                      name={"firstname"}
                    />
                    <ErrorMessage
                      name="firstname"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    {" "}
                    <Field
                      autoComplete="off"
                      type="text"
                      className={`${styles.loginformfields} form-control`}
                      placeholder="Last Name"
                      name={"lastname"}
                    />
                    <ErrorMessage
                      name="lastname"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <Field
                      autoComplete="off"
                      type="text"
                      className={`${styles.loginformfields} form-control `}
                      placeholder="Email Address"
                      name={"email"}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error"
                    />
                    {/* {emailCheck &&<p className="error"> Email Already Exists</p>} */}
                  </div>
                  <div className="col-md-12 mb-3">
                    <Field
                      autoComplete="off"
                      type="text"
                      className={`${styles.loginformfields} form-control `}
                      placeholder="Hospital / Institution"
                      name={"institute"}
                    />
                    <ErrorMessage
                      name="institute"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Field
                      autoComplete="off"
                      type="text"
                      className={`${styles.loginformfields} form-control `}
                      placeholder="City"
                      name={"city"}
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    {" "}
                    <Field
                      autoComplete="off"
                      type="text"
                      className={`${styles.loginformfields} form-control `}
                      placeholder="Country"
                      name={"country"}
                    />
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    {" "}
                    <Field
                      autoComplete="off"
                      type="password"
                      className={`${styles.loginformfields} form-control `}
                      placeholder="Passwrod"
                      name={"password"}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>
                <div className={`mt-2 form-checkl ${styles.checkboxSection} `}>
                  <Field
                    autoComplete="off"
                    type="checkbox"
                    className={`form-check-input  ${styles.formCheckInput}`}
                    id="exampleCheck1"
                    name="terms"
                  />
                  <label
                    className={`form-check-label ${styles.formCheckLabel} `}
                    htmlFor="terms"
                  >
                    Hereby I consent with Gore’s privacy policy (for more
                    information check <br />
                    <a target="_blank" href="https://www.gore.com/privacy">
                      www.gore.com/privacy
                    </a>
                    ){" "}
                  </label>
                  <ErrorMessage
                    name="terms"
                    component="div"
                    className="error"
                  />
                </div>
                <div className={`mt-3 ${styles.text_end} mt-3`}>
                {/* "text-end mt-3" */}
                  <button className={`${styles.red_btn}`} type="submit">
                    {" "}
                    Signup 
                    {/* <img src={WhiteArrow} />{" "} */}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </Formik>
        <div className="copyright">© 2023 W.L. Gore & Associates</div>
      </div>
      {/* <audio ref={audioRef} src={audioFile} autoPlay /> */}
    </div>
  );
};

export default SignupPlayer;

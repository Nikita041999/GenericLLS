import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useContext,
} from "react";
// import { Formik, useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import TextField from "../InputFields/TextField";
import TopRowImg from "assets/images/top-row-img.svg";
import WhiteArrow from "assets/images/white-arrow.svg";
import styles from "./LoginPlayer.module.css";
import audioFile from "../../assets/sounds/Quiz_NotPlaying.mp3";
import { userLogin } from "../../lib/network/loginauth";
import { usePlayerContext } from "lib/contexts/playerContext";
import { toast } from "react-toastify";
import { UserContext } from "lib/contexts/userContext";
import * as Yup from "yup";

const LoginPlayer = () => {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [audio, SetAudio] = useState("");
  //   const [emailCheck, setEmailCheck] = useState(false);
  const navigate = useNavigate();
  const userStore = useContext(UserContext);

  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Please enter valid Email.")
      .required("Email is required.")
      .max(50, "Email must be at most 50 characters."),
    password: Yup.string().required("Password is required."),
  });

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"));
    if (token) {
      navigate("/introduction");
    }
    SetAudio(new Audio(audioFile));
  }, []);

  useEffect(() => {
    if (showError == true) {
      //   toast(error, { type: "error" });
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
    setLoading(true);
    addPlayerData(values).then((res) => {
      if (res.data != undefined && res.data.length == 1) {
        setLoading(false);
        // console.log(res.data.data[0]);
        const { email_address, password } = res.data[0];
        const values = {
          email_address,
          password,
        };
        window.localStorage.setItem("user", JSON.stringify(res.data[0]));
        navigate(`/introduction`);
        // window.location.href = "/users";
      } else if (res.data.length == 0) {
        setShowError(true);
        setError(res.message);
        setLoading(false);
      } else {
        const errors = res.error;
        if (errors) {
          setShowError(true);
          setError(errors);
          setLoading(false);
        }
      }
    });
  };

  const addPlayerData = async (values) => {
    return userStore
      .userLogin(values)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    navigate("/signup");
  };
  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
    // userStore.userChangePassword()
  };
  return (
    <div className={styles.loginPage}>
      <div className="top-hor-img">
        <img src={TopRowImg} className="w-100" />
      </div>
      <div className={`${styles.container_fluid_login}`}>
        <h2 style={{ alignSelf: "center" }}>SIGN IN</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <div className="row justify-content-center">
              <div className="col-md-9">
                <div className="row gx-5">
                  <div className="col-md-12 mb-3">
                    <Field
                      autoComplete="off"
                      type="text"
                      className={`${styles.loginformfields} form-control `}
                      placeholder="E-mail Address"
                      name={"email"}
                    />
                    <ErrorMessage
                      name="email"
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
                <div
                  className="text-end mt-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    margin:"0px !important"
                  }}
                >
                  <div style={{display:"flex", justifyContent:"space-between", margin:"0rem 1rem 0.5rem 1rem"}}>
                    <p style={{ marginBottom: "0", cursor: "pointer" }}>
                      <a onClick={handleForgotPassword}>Forgot Password?</a>
                    </p>
                    <p style={{ marginBottom: "0" }}>
                      <a
                        style={{
                          textAlign: "left",
                          cursor: "pointer",
                          color: "#E60200",
                        }}
                        onClick={handleSignUp}
                      >
                        {" "}
                        signup
                      </a>
                    </p>
                  </div>
                  <button className={`${styles.red_btn}`} type="submit">
                    {" "}
                    Sign In 
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

export default LoginPlayer;

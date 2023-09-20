import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useContext,
} from "react";
// import { Formik, useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "../InputFields/TextField";
import TopRowImg from "assets/images/top-row-img.svg";
import WhiteArrow from "assets/images/white-arrow.svg";
import styles from "./LoginPlayer.module.css";
import audioFile from "../../assets/sounds/Quiz_NotPlaying.mp3";
import { userLogin } from "../../lib/network/loginauth";
import { usePlayerContext } from "lib/contexts/playerContext";
import { toast } from "react-toastify";
import { UserContext } from "lib/contexts/userContext";
// import { GoogleLoginButton } from "react-social-login-buttons";
import GlobalLoginButtons from "./GlobalLoginButtons";

import * as Yup from "yup";
import { getGitHubUrl } from "utils/getGithubUrl";
import { getGoogleUrl } from "utils/getGoogleUrl";
import { getLinkedInUrl } from "utils/getLinkedInUrl";
import { getFacebookUrl } from "utils/getFacebookUrl";
import { getTwitterUrl } from "utils/getTwitterUrl";

const LoginPlayer = () => {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [audio, SetAudio] = useState("");
  const [provider, setProvider] = useState("");
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

  async function getGithubUserData() {
    const token = "Bearer " + localStorage.getItem("accessToken");
    fetch("http://localhost:4000/getGithubUserData", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        if (data.data != undefined) {
          const value = { login: data.data.login, id: data.data.id };
          localStorage.setItem("user", JSON.stringify(value));
          navigate(`/introduction`);
        } else {
          localStorage.removeItem("accessToken");
        }
      })
      .catch((err) => {
        // const errors = res.error;
        console.log("*****", err);
      });
  }
  async function googleUserData() {
    const token = "Bearer " + localStorage.getItem("accessToken");
    fetch("http://localhost:4000/getGoogleUserData", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        console.log(1);
        console.log(res);
        return res.json();
      })
      .then((data) => {
        if (data.data != undefined) {
          const value = {
            email: data.data.email,
            id: data.data.id,
            name: data.data.name,
          };
          localStorage.setItem("user", JSON.stringify(value));
          navigate(`/introduction`);
        } else {
          localStorage.removeItem("accessToken");
        }
      })
      .catch((err) => {
        // const errors = res.error;
        console.log("*****", err);
      });
  }
  async function facebookUserData() {
    console.log("*****");
    const token = "Bearer " + localStorage.getItem("accessToken");
    fetch("http://localhost:4000/getFacebookUserData", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        console.log(1);
        console.log(res);
        return res.json();
      })
      .then((data) => {
        if (data.data != undefined) {
          const value = {
            email: data.data.email,
            id: data.data.id,
            name: data.data.name,
          };
          localStorage.setItem("user", JSON.stringify(value));
          navigate(`/introduction`);
        } else {
          localStorage.removeItem("accessToken");
        }
      })
      .catch((err) => {
        // const errors = res.error;
        console.log("*****", err);
      });
  }

  async function linkedInUserData() {
    const token = "Bearer " + localStorage.getItem("accessToken");
    console.log("********Token***",token)
    fetch("http://localhost:4000/getLinkedUserData", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log("data*********",data)
        if (data.data != undefined) {
          const value = {
            email: data.data.email,
            id: data.data.id,
            name: data.data.name,
          };
          localStorage.setItem("user", JSON.stringify(value));
          navigate(`/introduction`);
        } else {
          localStorage.removeItem("accessToken");
        }
      })
      .catch((err) => {
        // const errors = res.error;
        console.log("*****", err);
      });
  }
  async function twitterUserData() {
    const token = "Bearer " + localStorage.getItem("accessToken");
    fetch("http://localhost:4000/getTwitterUserData", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        if (data.data != undefined) {
          const value = {
            email: data.data.email,
            id: data.data.id,
            name: data.data.name,
          };
          localStorage.setItem("user", JSON.stringify(value));
          navigate(`/introduction`);
        } else {
          localStorage.removeItem("accessToken");
        }
      })
      .catch((err) => {
        // const errors = res.error;
        console.log("*****", err);
      });
  }
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"));
    if (token) {
      navigate("/introduction");
    }
    SetAudio(new Audio(audioFile));

    if (localStorage.getItem("provider")) {
      console.log(provider);
      const selectedProvider = localStorage.getItem("provider");
      if (selectedProvider == "google") {
        console.log("Its google");
        setProvider("google");
      } else if (selectedProvider == "github") {
        setProvider("github");
      } else if (selectedProvider == "linkedin") {
        setProvider("linkedin");
      } else if (selectedProvider == "facebook") {
        setProvider("facebook");
      } else if (selectedProvider == "twitter") {
        console.log("twii");
        setProvider("twitter");
      }
    }
  }, []);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log("codeParam", codeParam);
    console.log("------>", provider, provider === "twitter");
    if (codeParam && localStorage.getItem("accessToken") === null) {
      async function getGithubAccessToken() {
        await fetch(
          "http://localhost:4000/getGithubAccessToken?code=" + codeParam,
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
            }
          })
          .then((res) => {
            getGithubUserData();
          });
      }
      async function getGoogleAccessToken() {
        await fetch(
          "http://localhost:4000/getGoogleAccessToken?code=" + codeParam,
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              googleUserData();
            }
          });
        // .then((res) => {
        //   googleUserData();
        // });
      }
      async function getLinkedInAccessToken() {
        await fetch(
          "http://localhost:4000/getLinkedInAccessToken?code=" + codeParam,
          {
            method: "GET",
          }
        )
          .then((res) => {
           
            return res.json();
          })
          .then((data) => {
            console.log("linkdinTokenResponse",data)
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              linkedInUserData();
            }
          });
      }
      async function getFacebookAccessToken() {
        console.log("ffb");
        await fetch(
          "http://localhost:4000/getFacebookAccessToken?code=" + codeParam,
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              facebookUserData();
            }
          });
      }
      async function getTwitterAccessToken() {
        console.log("getTwitterAccessToken");
        await fetch(
          "http://localhost:4000/getTwitterAccessToken?code=" + codeParam,
          {
            method: "GET",
          }
        )
          .then((res) => {
            console.log("333333333",res);
            return res.json();
          })
          .then((data) => {
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              twitterUserData();
            }
          });
      }
      if (provider === "google") {
        console.log(111);
        getGoogleAccessToken();
      } else if (provider === "github") {
        console.log(1111);
        getGithubAccessToken();
      } else if (provider === "linkedin") {
        console.log(11111);
        getLinkedInAccessToken();
      } else if (provider === "facebook") {
        console.log(11111);
        console.log("provider", provider);
        getFacebookAccessToken();
      } else if (provider === "twitter") {
        console.log(11111);
        console.log("provider", provider);
        getTwitterAccessToken();
      }
    }
  }, [provider]);

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
        localStorage.setItem("user", JSON.stringify(res.data[0]));
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

  const handleProviderIdentity = (e) => {
    let text = e.target.textContent;
    if (text.toLowerCase().includes("google")) {
      localStorage.setItem("provider", "google");
    } else if (text.toLowerCase().includes("github")) {
      localStorage.setItem("provider", "github");
    } else if (text.toLowerCase().includes("linkedin")) {
      localStorage.setItem("provider", "linkedin");
    } else if (text.toLowerCase().includes("facebook")) {
      localStorage.setItem("provider", "facebook");
    } else if (text.toLowerCase().includes("twitter")) {
      localStorage.setItem("provider", "twitter");
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("provider", "google");
    // handleProviderIdentity(e);
    const url = getGoogleUrl();
    // console.log(url);
    window.location.assign(`${url}`);
  };

  const handleGithubLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("provider", "github");
    // handleProviderIdentity(e);
    const url = getGitHubUrl();
    // console.log(url);
    window.location.assign(`${url}`);
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
  const handleLinkedInLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("provider", "linkedin");
    // handleProviderIdentity(e);
    const url = getLinkedInUrl();
    // const url = 'http://localhost:3000/auth/linkedin'
    window.location.assign(`${url}`);
  };

  const handleTwitterLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("provider", "twitter");
    // handleProviderIdentity(e);

    const url = getTwitterUrl();
    
    console.log("clicked twitter");
    window.location.assign(`${url}`);
  };
  const handleFacebookLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("provider", "facebook");
    // handleProviderIdentity(e);
    const url = getFacebookUrl();
    // const url = 'http://localhost:3000/auth/linkedin'
    window.location.assign(`${url}`);
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
                      placeholder="Email Address"
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
                    margin: "0px !important",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: "0rem 1rem 0.5rem 1rem",
                    }}
                  >
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
                        Signup
                      </a>
                    </p>
                  </div>
                  <button className={`${styles.red_btn}`} type="submit">
                    {" "}
                    {/* Sign In  */}
                    Login
                    {/* <img src={WhiteArrow} />{" "} */}
                  </button>
                  <div>
                    <GlobalLoginButtons
                      handleGithubLogin={handleGithubLogin}
                      handleGoogleLogin={handleGoogleLogin}
                      handleLinkedInLogin={handleLinkedInLogin}
                      handleTwitterLogin={handleTwitterLogin}
                      handleFacebookLogin={handleFacebookLogin}
                    />
                  </div>
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

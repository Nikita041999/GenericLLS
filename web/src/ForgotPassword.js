import logo from "assets/images/logo.svg";
import Footer from "components/Layout/Footer";
import TextField from "components/InputFields/TextField";
import { useFormik } from "formik";
import { forgotPassword } from "lib/network/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Loader from "components/Loader";
import { toast } from "react-toastify";
function ForgotPassword() {
  const [showError, setShowError] = useState(false);
 
  const [loading, setLoading] = useState(false);
  const [showMessage, setMessage] = useState(false);
  
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter valid Email")
        .required("Please enter Email"),
    }),
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      setShowError(false);
      setLoading(true);
      setMessage(false);
      forgotPassword(values)
        .then((res) => {
          const { reset_link } = res.data.data;
          setLoading(false);
          toast(res.data.message, { type: "success" });
          formik.values.email = "";
          // setMessage(res.data.message);
          // window.location.href = reset_link;
        })
        .catch((err) => {
          setShowError(err.response.data.message);
          setLoading(false);
        });
    },
  });

  return (
    <div className="outer">
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
                    <span>Forgot Password!</span>Tradeshow  Admin Panel
                  </h1>
                </div>
                <div style={{ color: "#F06D91" }}>{showMessage}</div>
                <form onSubmit={formik.handleSubmit}>
                  <div className="row g-3">
                    {showError ? (
                      <span className="error">{showError}</span>
                    ) : (
                      ""
                    )}
                    <div className="col-md-12">
                      <TextField
                        name="email"
                        showIcon={true}
                        icon={"emailSvg"}
                        placeholder="Email"
                        formik={formik}
                      />
                    </div>

                    <div className="col-md-12 pt-2">
                      {/* comment as per  QA  */}
                      {/* {loading ? (
                        <Loader />
                      ) : (
                        <button
                          className="btn btn-primary w-100 text-center"
                          type="submit"
                          disabled={loading}
                        >
                          Reset Password
                        </button>
                      )} */}

                      <button
                        className="btn btn-primary w-100 text-center"
                        type="submit"
                        disabled={loading}
                      >
                        Reset Password
                      </button>
                    </div>
                    <div className="col-md-12">
                      <div className="text-center w-100 pt-2">
                        <a href="/">Back to login</a>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ForgotPassword;

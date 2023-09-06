import logo from "assets/images/logo.svg";
import Footer from "components/Layout/Footer";
import TextField from "components/InputFields/TextField";
import { useFormik } from "formik";
import { resetPassword, verifyLink } from "lib/network/auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import { validation_regex } from "lib/validation_regex";
import { messages } from "lib/messages";

function ResetPassword() {
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setPageLoading(true);
    verifyLink(params)
      .then((res) => {
        setPageLoading(false);

        // console.log("res");
      })
      .catch((er) => {
        // console.log("er", er);
        setIsExpired(true);
        setPageLoading(false);
      });
  }, []);
  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
      _id: params._id,
      verify_string: params.verify_string,
    },
    validationSchema: Yup.object({
      new_password: Yup.string()
        .required("Please enter Password")
        .matches(validation_regex.password, messages.password),
      confirm_password: Yup.string()
        .oneOf(
          [Yup.ref("new_password"), null],
          "Password and confirm password does not match"
        )
        .required("Please enter Confirm Password"),
    }),
    onSubmit: (values) => {
      setShowError(false);
      setLoading(true);
      setShowMessage(false);
      resetPassword(values)
        .then((res) => {
          setLoading(false);
          // console.log("res", res);
          if (res.data.data == "admin") {
            toast(res.data.message, { type: "success" });
            navigate("/");
          } else {
            setShowMessage(res.data.message);
          }
        })
        .catch((err) => {
          setShowError(err.response.data.message);
          setLoading(false);

          // console.log("err", err.response.data.message);
        });
    },
  });
  return pageLoading ? (
    <div className="expiredif">
      <Loader />
    </div>
  ) : isExpired ? (
    <div className="expiredif">
      <div>
        <img src={logo} alt="logo-large" className="mb-5" width="160" />

        <h1>The Link has been Expired</h1>
      </div>

      <Footer />
    </div>
  ) : (
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
                    <span>Reset Password!</span>
                  </h1>
                </div>
                {showMessage ? (
                  <h1>{showMessage}</h1>
                ) : (
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row g-3">
                      {showError ? (
                        <span className="error">{showError}</span>
                      ) : (
                        ""
                      )}
                      <div className="col-md-12">
                        <TextField
                          type="password"
                          name="new_password"
                          showIcon={true}
                          icon={"passwordSvg"}
                          placeholder="New Password"
                          formik={formik}
                        />
                      </div>
                      <div className="col-md-12">
                        <TextField
                          name="confirm_password"
                          type="password"
                          showIcon={true}
                          icon={"passwordSvg"}
                          placeholder="Confirm Password"
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
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ResetPassword;

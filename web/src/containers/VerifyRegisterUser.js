import logo from "assets/images/logo.svg";
import Footer from "components/Layout/Footer";
import { verifyUserRegister } from "lib/network/auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "components/Loader";

function VerifyRegisterUser() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    let data = {
      ...params,
    };
    setLoading(true);
    verifyUserRegister(data)
      .then((res) => {
        setMessage("Your account is Verified.");

        setLoading(false);
      })
      .catch((er) => {
        setLoading(false);
        setMessage("The Link has been Expired");
      });
  }, []);

  return (
    <div className="expiredif">
      <div>
        <img src={logo} alt="logo-large" className="mb-5" width="160" />

        {loading ? <Loader /> : <h1>{message}</h1>}
        {/* <p>sdfsdf sdf sdfsd fsdf sdf</p> */}
      </div>

      <Footer />
    </div>
  );
}

export default VerifyRegisterUser;

import React, { createContext, useEffect, useState } from "react";
import { changePassword, login } from "lib/network/auth";
import { toast } from "react-toastify";

export const UserContext = createContext();
// const stripe = dynamic(() => import("@stripe/stripe-js"));
// This context provider is passed to any component requiring the context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  useEffect(() => {
    setUser(sessionStorage.getItem("player") ? true : false);
  }, [sessionStorage.getItem("player")]);
  // useEffect(() => {
  //   setUser(sessionStorage.getItem("player") ? true : false);
  // }, []);
  const userLogin = async (values) => {
    try {
      const res = await login(values);
      // console.log("****err*****", res);
      // window.stop()
      sessionStorage.setItem("player", JSON.stringify(res.data.data));
      sessionStorage.setItem("player-token", res.data.token);
      return { status: res.data.status, data: res.data.data };
    } catch (err) {
      // console.log("****err*****", err.response.data.message)
      window.stop();
      return { status: false, error: err.response.data.message };
    }
  };
  const userChangePassword = (values) => {
    return changePassword(values)
      .then((res) => {
        toast(res.data.message, { type: "success" });
        return { status: true, data: res.data.data };
      })
      .catch((err) => {
        return { status: false, error: err.response.data.message };
      });
  };

  return (
    <UserContext.Provider
      value={{
        data: {
          ...user,
        },
        userLogin,
        userChangePassword,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

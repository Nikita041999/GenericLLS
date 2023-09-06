import React, { createContext, useEffect, useState } from "react";
// import { changePassword, login } from "lib/network/auth";
import {
  login,
  register,
  resetPassword,
  changePassword,
} from "lib/network/loginauth";
import { toast } from "react-toastify";

export const UserContext = createContext();
// const stripe = dynamic(() => import("@stripe/stripe-js"));
// This context provider is passed to any component requiring the context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  useEffect(() => {
    setUser(localStorage.getItem("user") ? true : false);
  }, [localStorage.getItem("user")]);
  const userLogin = async (values) => {
    try {
      const res = await login(values);
      window.stop();
      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("user-token", res.data.token);
      // return { status: res.data.status, data: res.data.data };
      return {
        status: res.data.status,
        data: res.data.data,
        message: res.data.message,
      };
    } catch (err) {
      window.stop();
      // return { status: false, error: err.response.data.message };
      return { status: false, error: err.response.data.message };
    }
  };
  const userRegister = async (values) => {
    try {
      const res = await register(values);
      // window.stop()
      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("user-token", res.data.token);
      return {
        status: res.data.status,
        data: res.data.data,
        message: res.data.message,
      };
    } catch (err) {
      console.log("****err*****", err.response.data.message);
      window.stop();
      return { status: false, error: err.response.data.message };
    }
  };
  const userChangePassword = async (values) => {
    console.log("***values***", values);
    return changePassword(values)
      .then((res) => {
        // toast(res.data.message, { type: "success" });
        return { status: res.data.status, message: res.data.message };
      })
      .catch((err) => {
        return { status: false, error: err.response.data.message };
      });
  };

  const userForgetPassword = async (values) => {
    console.log("values******", values);
    return resetPassword(values)
      .then((res) => {
        console.log("is res", res);
        // toast(res.data.message, { type: "success" });
        return { status: res.data.status, message: res.data.message };
      })
      .catch((err) => {
        console.log("in error", err);
        // return { status: false, error: err.response.data.message };
        return { status: false, error: err };
      });
  };

  return (
    <UserContext.Provider
      value={{
        data: {
          ...user,
        },
        userRegister,
        userLogin,
        userChangePassword,
        userForgetPassword,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

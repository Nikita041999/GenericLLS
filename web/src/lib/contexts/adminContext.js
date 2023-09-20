import {
    adminchangepassword,
    adminlogin,
    adminresetpassword,
  } from "lib/network/loginauth";
  import React, { createContext, useContext, useEffect,useState } from "react";
  
  export const AdminContext = createContext();
  
  export const AdminProvider = ({ children }) => {
    const [admin, setadmin] = useState(false);
    useEffect(() => {
      setadmin(localStorage.getItem("admin") ? true : false);
    }, [localStorage.getItem("admin")]);
    const adminLogin = async (values) => {
      try {
        const res = await adminlogin(values);
        window.stop();
        localStorage.setItem("admin", JSON.stringify(res.data.data));
        localStorage.setItem("admin-token", res.data.token);
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
  
    const adminChangePassword = async (values) => {
      console.log("***values***", values);
      return adminchangepassword(values)
        .then((res) => {
          // toast(res.data.message, { type: "success" });
          return { status: res.data.status, message: res.data.message };
        })
        .catch((err) => {
          return { status: false, error: err.response.data.message };
        });
    };
  
    const adminForgetPassword = async (values) => {
      console.log("values******", values);
      return adminresetpassword(values)
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
      <AdminContext.Provider
        value={{
          data: {
            ...admin,
          },
          adminLogin,
          adminChangePassword,
          adminForgetPassword,
          admin,
        }}
      >
        {children}
      </AdminContext.Provider>
    );
  };
  
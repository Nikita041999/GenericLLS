import axios from "axios";
import { toast } from "react-toastify";

const auth = () => {
  if (localStorage.getItem("Tradeshow-token")) {
    return {
      Authorization: localStorage.getItem("Tradeshow-token"),
    };
  } else {
    return {};
  }
};
const axiosClient = axios.create({
  // baseURL: process.env.REACT_APP_DEV_BASEURL,
  // baseURL: "https://tradeshowappnew.24livehost.com:4001",
  // baseURL: "https://tradeshowapp.24livehost.com:4001",
  // baseURL: `http://localhost:4000`,
  baseURL: `https://generic-lls-p34g.vercel.app`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...auth(),
  },
});
axiosClient.interceptors.response.use(
  function (response) {
    return { data: response.data };
  },
  function (error) {
    let res = error.response;
    if (res.status == 401) {
      toast.error(res.data.message);
      window.location.href = "/";
    }
    console.error("Looks like there was a problem. Status Code: " + res.status);
    return Promise.reject(error);
  }
);
export default axiosClient;

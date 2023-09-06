import axiosClient from "../request";

export function login(data) {
    console.log("data",data);
  return axiosClient.post("/api/login", data);
}
export function register(data) {
    console.log("data",data);
  return axiosClient.post("/api/signup", data);
}
export function resetPassword(data) {
  return axiosClient.post("api/reset-password", data);
}

export function changePassword(data) {
  return axiosClient.post("api/change-password", data);
}
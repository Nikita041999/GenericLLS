import axiosClient from "../request";

export function login(data) {
  console.log("data", data);
  return axiosClient.post("/api/login", data);
}
export function register(data) {
  console.log("data", data);
  return axiosClient.post("/api/signup", data);
}
export function resetPassword(data) {
  return axiosClient.post("api/reset-password", data);
}

export function changePassword(data) {
  return axiosClient.post("api/change-password", data);
}

export function adminlogin(data) {
  console.log(1, data);
  return axiosClient.post("/admin/admin-login", data);
}
export function adminchangepassword(data) {
  return axiosClient.post("/admin/change-password", data);
}
export function adminresetpassword(data) {
  return axiosClient.post("/admin/forget-password", data);
}
export function quizDataAdd(data) {
  return axiosClient.post("/admin/quiz-data-add", data);
}

export function quizQuestionList() {
  return axiosClient.get("/admin/quiz-list");
}

export function getSingleQuestionData(data) {
  return axiosClient.post("/admin/question-data",data);
}

export function deleteQuizData(data) {
  return axiosClient.post("/admin/delete-question",data);
}

export function editQuestionData(data){
  return axiosClient.post("/admin/edit-question",data);
}

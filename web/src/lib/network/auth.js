import axiosClient from "../request";

export function login(data) {
  return axiosClient.post("/admin/admin-login", data);
}

export function playerLogin(params) {
  return axiosClient.get("/api/playerDetail", {params});
}

export function getQuizData() {
  return axiosClient.get("/api/getQuizData");
}


export function pushAttemptedOption(data) {
  return axiosClient.post("api/quizResult", data);
}


export function playerRegister(data) {
  return axiosClient.post("/api/playerDetail", data);
}

export function quizResultScreen(params) {
  return axiosClient.get("/api/timeDifference", {params});
}


export function getAllQuestionsdata() {
  return axiosClient.get("/api/get_questions");
}

export function checkSelectedOption(data) {
  return axiosClient.post("/api/matchAnswers",data);
}

export function forgotPassword(data) {
  return axiosClient.post("admin/auth/forgetPassword", data);
}

export function verifyLink(params) {
  return axiosClient.get("admin/auth/verifyResetLink", { params });
}
export function resetPassword(data) {
  return axiosClient.post("admin/auth/resetPassword", data);
}

export function changePassword(data) {
  return axiosClient.post("admin/auth/changePassword", data);
}
export function verifyUserRegister(data) {
  return axiosClient.post("auth/verify-user", data);
}

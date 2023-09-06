import axiosClient from "../request";

export function getDashboard(params) {
  return axiosClient.get("admin/getadmindashboardinfo");
}

export function getUsers(params) {
  return axiosClient.get("admin/players", { params });
}

export function getUsersByDateFilter(params) {
  return axiosClient.get("admin/players", {params });
}

export function getValuesBySearchFilter(params){
  return axiosClient.get("admin/players", {params});
}


export function getUserDetail(params) {
  return axiosClient.get("admin/user/getuserdetails", { params });
}


export function toggleBlockUser(data) {
  return axiosClient.post("admin/user/toggle-block", data);
}

export function deleteUser(data) {
  return axiosClient.delete("admin/user/delete-user", { data });
}

export function getEvents(params) {
  return axiosClient.get("admin/getallevents", { params });
}

export function getEventDetail(params) {
  return axiosClient.get("admin/event-detail", { params });
}

export function deleteEvent(data) {
  return axiosClient.delete("admin/event", { data });
}

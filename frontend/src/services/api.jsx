import axios from "axios";

let api;

if (!import.meta.env.MODE || import.meta.env.MODE === "development") {
  api = axios.create({
    baseURL: "/api",
  });
} else {
  api = axios.create({
    baseURL: "/api",
  });
}

export const getProjects = (filters) =>
  api.get("/projects", { params: filters }).then((res) => {
    return res.data;
  });

export const getProjectDetail = (project_code) =>
  api.get(`/project_detail/${project_code}`).then((res) => res.data);

export const getFN121 = (project_code) =>
  api.get(`/${project_code}/fn121`).then((res) => res.data);

export const getFN123 = (project_code) =>
  api.get(`/${project_code}/fn123`).then((res) => res.data);

export const getFN125 = (project_code) =>
  api.get(`/${project_code}/fn125`).then((res) => res.data);

export const getProjectSeasons = (project_code) =>
  api.get(`/${project_code}/fn022`).then((res) => res.data);

export const getProjectDayTypes = (project_code) =>
  api.get(`/${project_code}/fn023`).then((res) => res.data);

export const getProjectPeriods = (project_code) =>
  api.get(`/${project_code}/fn025`).then((res) => res.data);

export const getProjectExceptionDates = (project_code) =>
  api.get(`/${project_code}/fn025`).then((res) => res.data);

export const getProjectSpaces = (project_code) =>
  api.get(`/${project_code}/fn026`).then((res) => res.data);

export const getProjectModes = (project_code) =>
  api.get(`/${project_code}/fn028`).then((res) => res.data);

export const getProjectGears = (project_code) =>
  api.get(`/${project_code}/fn013`).then((res) => res.data);

export const getProjectSubGears = (project_code, gr) =>
  api.get(`/${project_code}/fn014`).then((res) => res.data);

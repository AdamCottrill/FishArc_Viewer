import axios from "axios";
import queryString from "query-string";

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

const ProjectTypes = {
  FS: "Fish Stocking",
  IA: "Index Adult/Juvenile",
  IE: "Index Eggs",
  IL: "Index Larvae",
  IS: "Index Spawners",
  IM: "Index Migrants",
  SA: "Sport Activity",
  SD: "Sport Diary",
  SC: "Sport Creel",
  SF: "Sport Fish",
  SM: "Sport Mail",
  CH: "Commercial Harvest",
  CF: "Commercial Fish On-board catching sampling",
  CD: "Commercial Fish Dockside sampling",
  CP: "Commercial Fish Plant Sampling",
  TR: "Tag Report",
  TS: "Tag Summary",
  CC: "Contaminant Collections",
};

export async function getProjects(filters) {
  const data = api
    .get("/projects/", {
      params: filters,
      paramsSerializer: (params) =>
        queryString.stringify(params, { arrayFormat: "comma" }),
    })

    .then((response) => response.data);

  return data;
}

export const getFN011Filters = () =>
  api.get("/project_filters/").then((res) => {
    const { fof, project_types, suffixes, years } = res.data;

    const _fof = fof.map((x) => ({ value: x, label: `${x}_*` }));
    const _project_types = project_types.map((x) => ({
      value: x,
      label: ProjectTypes[x] ? `${ProjectTypes[x]} (${x})` : `Other (${x})`,
    }));
    const _suffixes = suffixes.map((x) => ({ value: x, label: `*_${x}` }));

    const _years = years.map((x) => ({
      value: x,
      label: parseInt(x) < 50 ? "20" + x : "19" + x,
    }));

    _years.sort((a, b) => a.label - b.label);

    return {
      fof: _fof,
      project_types: _project_types,
      suffixes: _suffixes,
      years: _years,
    };
  });

export const getProjectDetail = (project_code) =>
  api.get(`/project_detail/${project_code}/`).then((res) => res.data);

export const getFN121 = (project_code) =>
  api.get(`/${project_code}/fn121/`).then((res) => res.data);

export const getFN123 = (project_code) =>
  api.get(`/${project_code}/fn123/`).then((res) => res.data);

export const getFN123Filters = (project_code) =>
  api.get(`/${project_code}/fn123_filters/`).then((res) => res.data);

export const getFN125 = (project_code) =>
  api.get(`/${project_code}/fn125/`).then((res) => res.data);

export const getFN125Filters = (project_code) =>
  api.get(`/${project_code}/fn125_filters/`).then((res) => res.data);

//export const getProjectSeasons = (project_code) =>
//  api.get(`/${project_code}/fn022/`).then((res) => res.data);
//
//export const getProjectDayTypes = (project_code) =>
//  api.get(`/${project_code}/fn023/`).then((res) => res.data);
//
//export const getProjectPeriods = (project_code) =>
//  api.get(`/${project_code}/fn025/`).then((res) => res.data);
//
//export const getProjectExceptionDates = (project_code) =>
//  api.get(`/${project_code}/fn025/`).then((res) => res.data);
//
//export const getProjectSpaces = (project_code) =>
//  api.get(`/${project_code}/fn026/`).then((res) => res.data);
//
//export const getProjectModes = (project_code) =>
//  api.get(`/${project_code}/fn028/`).then((res) => res.data);
//
//export const getProjectGears = (project_code) =>
//  api.get(`/${project_code}/fn013/`).then((res) => res.data);
//
//export const getProjectSubGears = (project_code, gr) =>
//  api.get(`/${project_code}/fn014/`).then((res) => res.data);
//

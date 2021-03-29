import axios from "axios";
import authHeader from "./auth-header";
axios.defaults.withCredentials = true;

const API_URL = "http://localhost:3000/api/labour_desc/";

const getLabourDesc = () => {
  return axios.get(API_URL + "getLabDescs",{ headers: authHeader() });
};

const delLabourDescId = (id) => {
  return axios.delete(API_URL + "getLabDesc/"+id, { headers: authHeader() });
};

const service = {
  getLabourDesc,
  delLabourDescId,
};

export default service;

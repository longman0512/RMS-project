import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://localhost:3000/api/users/";
axios.defaults.withCredentials = true;

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {
      console.log(response.data.message.accessToken);
      if (response.data.message.accessToken) {
        console.log(response.data.message);
        localStorage.setItem("user", JSON.stringify(response.data.message));
      }

     return response.data.message;
    });
};

const refreshToken = () => {
  return axios.put(API_URL + "refreshToken", { 
    headers: authHeader() 
  },{
    withCredentials:true
  })
  .then((response) => {
    if (response.data.accessToken) {
      console.log(response.data.accessToken);
      let user = JSON.parse(localStorage.getItem("user"));
      user.accessToken = response.data.accessToken;
      localStorage.setItem("user", JSON.stringify(user));
    }

   return;
  });
}

const logout = () => {
  return axios.delete(API_URL + "logout", { 
    headers: authHeader() 
  },{
    withCredentials:true
  })
  .then(() => {
    localStorage.removeItem("user");
  
    return; 
  });
};

const auth = {
  register,
  login,
  logout,
  refreshToken,
};

export default auth;


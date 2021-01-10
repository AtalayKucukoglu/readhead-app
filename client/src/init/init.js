import axios from "axios";
import { setAuthorizationToken } from "../helpers/setAuthorizationToken";

export default function initApp() {
  // get jwt token from local storage 
  const jwtToken = localStorage.getItem("readhead-jwtToken");
  // set token to deafault request headers if wxists
  if (jwtToken) {
    setAuthorizationToken(jwtToken);
  }

  setAxiosDefaults()
}

function setAxiosDefaults() {
  axios.defaults.baseURL = 'http://localhost:5000/api';
}
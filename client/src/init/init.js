import axios from "axios";
import { setAuthorizationToken } from "../helpers/helpers.js";

export default function initApp() {
  setAxiosDefaults()
}



async function setAxiosDefaults() {
  axios.defaults.baseURL = 'http://localhost:5000/api';
  // get jwt token from local storage 
  const jwtToken = window.localStorage.getItem("readhead-jwtToken");
  console.log("initApp local storage token: ", jwtToken)
  // set token to deafault request headers if wxists
  if (jwtToken) {
    setAuthorizationToken(jwtToken);
  }
}
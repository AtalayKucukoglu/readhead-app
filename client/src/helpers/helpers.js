import axios from 'axios';
import store from './store'

// authorization related helpers

export const setAuthorizationToken = token => {
  if (token) {
    console.log("set auth token: ", token)
    axios.defaults.headers.common["Authorization"] = token;
    window.localStorage.setItem("readhead-jwtToken", token);
    return
  }
  else
    delete axios.defaults.headers.common["Authorization"];
    window.localStorage.removeItem("readhead-jwtToken")
    return
}

export const getAuthorizationToken = () => {
  const token = window.localStorage.getItem("readhead-jwtToken")
  return token || null
}

// user related helpers

// export const getUsername = () => {
//   return store.getState().auth.user.username || null
// }

// export const getUserId = () => {
//   return store.getState().auth.user.user_id || null
// }

export const getDateFormatted = (date) => {
  if (!date) return null
  return date.getYear() + '-' + date.getMonth() + '-' + date.getDate()
}

// redux related helpers

export const mapStateToProps = (state) => {
  const { isAuthenticated, error, errorMessage, user } = state.auth;
  const {favorites, toRead, haveRead} = state.lists;
  return {
    isAuthenticated,
    error,
    errorMessage,
    user,
    favorites,
    toRead,
    haveRead,
  }
}
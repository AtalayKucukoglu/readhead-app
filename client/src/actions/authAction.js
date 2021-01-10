import * as authServices from '../services/authServices';

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGOUT = "LOGOUT";
const defaultErrorMessage = "An error occured. Please try again later"

const loginSuccess = user => {
    return {
        type: LOGIN_SUCCESS,
        user
    };
};

const loginError = error => {
    return {
        type: LOGIN_ERROR,
        error
    };
};

export const login = (username, password) => {
    console.log("login action called")
    return dispatch => {
        authServices.login(username, password)
            .then(data => {
                console.log("response from login service: ", data)
                if (!data) {
                    dispatch(loginError(defaultErrorMessage))
                    return
                }
                !data.status
                    ? dispatch(loginError(data.message || defaultErrorMessage))
                    : (dispatch(loginSuccess(data)))
            })
            .catch(err => dispatch(loginError(err)));
    }
}

export const logout = () => {
    authServices.logout();
    return {
        type: LOGOUT
    };
}
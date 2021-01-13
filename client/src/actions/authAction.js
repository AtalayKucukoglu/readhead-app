import { setAuthorizationToken } from '../helpers/helpers';
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

export const login = (username, password, token = null) => {
    // try login via authorized token
    if (token && !username && !password) {
        console.log("login action try via token")
        return dispatch => {
            authServices.isTokenValid(token)
                .then(res => {
                    console.log("login action data: ", res)
                    if (res.status) {
                        return dispatch(loginSuccess(res.data))
                    }
                    else {
                        return dispatch(loginError(''))
                    }
                })
        }
    }
    return dispatch => {
        authServices.login(username, password)
            .then(res => {
                console.log("response from login service: ", res)
                if (!res) {
                    dispatch(loginError(defaultErrorMessage))
                    return
                }
                if (!res.status) {
                    return dispatch(loginError(res.message || defaultErrorMessage))
                }
                else {
                    console.log(res.token)
                    setAuthorizationToken(res.token)
                    return dispatch(loginSuccess(res.data))
                }
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
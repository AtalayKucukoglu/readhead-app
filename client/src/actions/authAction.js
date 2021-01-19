import { setAuthorizationToken } from '../helpers/helpers';
import * as authServices from '../services/authServices';

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGOUT = "LOGOUT";
const defaultErrorMessage = "An error occured. Please try again later."

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
		return dispatch => {
			authServices.isTokenValid(token)
				.then(res => {
					console.log("login action data: ", res)
					if ( res && res.status) {
						return dispatch(loginSuccess(res.data))
					}
					else {
						return dispatch(logout())
					}
				})
		}
	}
	return dispatch => {
		authServices.login(username, password)
			.then(res => {
				if (!res) {
					dispatch(loginError(defaultErrorMessage))
					return
				}
				if (!res.status) {
					return dispatch(loginError(res.message || defaultErrorMessage))
				}
				else {
					setAuthorizationToken(res.token)
					return dispatch(loginSuccess(res.data))
				}
			})
			.catch(err => dispatch(loginError(err)));
	}
}


export const register = (user) => {
	return dispatch => {
		authServices.register(user)
			.then(res => {
				console.log(res)
				if (!res) {
					dispatch(loginError(defaultErrorMessage))
					return
				}
				if (!res.status) {
					return dispatch(loginError(res.message || defaultErrorMessage))
				}
				else {
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
import axios from 'axios';
import { setAuthorizationToken } from "../helpers/helpers.js";

export const login = (username, password) => {
	console.log("login service called")
	return axios.post('/users/login', { username, password })
		.then(response => {
			console.log("response: ", response)
			if (!response) return {}
			return response.data;
		})
		.catch(err =>
			console.log(err)
		);
}

export const logout = () => {
	setAuthorizationToken(false);
}

export const isTokenValid = (token) => {
	console.log("istokenvalid func")
	return axios.get('/users/check_token')
		.then(res => {
			if (!res || !res.status) return false
			console.log(res.data)
			return res.data
		})
		.catch(err =>
			console.log(err)
		)
}
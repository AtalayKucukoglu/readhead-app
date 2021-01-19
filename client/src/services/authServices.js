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
	return axios.get('/users/check_token')
		.then(res => {
			if (!res || !res.status) return false
			return res.data
		})
		.catch(err =>
			console.log(err)
		)
}

export const register = (user) => {
	return axios.post('/users/register', {
		'username': user.username,
		'email': user.email,
		'password': user.password,
		'birth_date': user.birthdate || null,
		'gender': user.gender || null
	})
		.then(response => {
			console.log("response: ", response)
			if (!response) return {}
			return response.data;
		})
		.catch(err =>
			console.log(err)
		);
}
import axios from 'axios';
import { setAuthorizationToken } from "../helpers/setAuthorizationToken";

export const login = (username, password) => {
	console.log("login service called")
	return axios.post('/users/login', { username, password })
		.then(response => {
			console.log("response: ", response)
			if (!response) return {}
			if (response.status) {
				const { token } = response.data;
				localStorage.setItem("readhead-jwtToken", token);
				setAuthorizationToken(token);
			}
			return response.data;
		})
		.catch(err => 
			console.log(err)
		);
}

export const logout = () => {
	localStorage.removeItem("readhead-jwtToken");
	setAuthorizationToken(false);
}

export const getUserWithUsername = username => {
	let data = null
	
	return new Promise((resolve, reject) => {
		axios.get('/users/' + username)
			.then(res => {
				data = res.data
			})
			.catch(error => {
				console.log(error)
			})
			.then(() => {
				resolve(data)
			})
	});
}

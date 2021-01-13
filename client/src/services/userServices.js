import axios from 'axios'

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

export const getUserLists = username => {
	let data = null
	const favorites = axios.get('/users/' + username + '/favorites')
	const toRead = axios.get('/users/' + username + '/to-read')
	const haveRead = axios.get('/users/' + username + '/have-read')
		return Promise.all([favorites, toRead, haveRead]).then(axios.spread((...responses) => {
			data = {
				favorites: responses[0],
				to_read: responses[1],
				have_read: responses[2]	
			}
			return data
			// use/access the results 
		})).catch(errors => {
			// react on errors.
			console.log(errors)
			return null
		})
	}
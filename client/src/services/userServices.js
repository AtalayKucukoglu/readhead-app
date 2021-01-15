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

export const getFavoritesList = (username) => {
	return axios.get('/users/' + username + '/favorites')
		.then(res => {
			if (res.data && res.data.status) {
				return res.data.data
			}
		})
		.catch(err => console.log(err))
}

export const getHaveReadList = (username) => {
	return axios.get('/users/' + username + '/have-read')
		.then(res => {
			if (res.data && res.data.status) {
				return res.data.data
			}
		})
		.catch(err => console.log(err))
}

export const getToReadList = (username) => {
	return axios.get('/users/' + username + '/to-read')
		.then(res => {
			if (res.data && res.data.status) {
				return res.data.data
			}
		})
		.catch(err => console.log(err))
}

export const getAllLists = async (username) => {
	const favorites = await getFavoritesList(username)
	const toRead = await getToReadList(username)
	const haveRead = await getHaveReadList(username)

	return {
		favorites,
		toRead,
		haveRead,
	}
}

export const addBookToList = (username, book_id, listname) => {
	return axios.post('/users/' + username + '/' + listname, { book_id })
		.then(res => {
			if (res && res.data) return res.data
			else return null
		})
		.catch(err => {
			console.log(err)
			return null
		})
}

export const deleteBookFromList = (username, book_id, listname) => {
	return axios.delete('/users/' + username + '/' + listname, { data: {book_id} }) // delete operations needs 'data' to be specified
		.then(res => {
			if (res && res.data) return res.data
			else return null
		})
		.catch(err => {
			console.log(err)
			return null
		})
}
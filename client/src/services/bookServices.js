import axios from 'axios'

// TODO: pagination when searching
export const searchBooksByTitle = input => {
	return axios.post('/books/search', { "value": input })
		.then(res => {
			if (res && res.data && res.data.status) {
				return res.data.data
			}
			else return null
		})
		.catch(error => {
			console.log(error)
		})
}

export const getBookById = (bookId) => {
	return axios.get('books/' + bookId)
		.then(res => {
			if (res && res.data && res.data.status) {
				return res.data.data
			}
			else return null
		})
		.catch(err => console.log(err))
}

export const updateBook = (bookId, data) => {
	return axios.put('/authors/' + bookId + '/update', { data })
		.then(res => {
			console.log(res)
			if (res && res.data) return res.data
			else return null
		})
		.catch(err => {
			console.log(err)
			return null
		})
}
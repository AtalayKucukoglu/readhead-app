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


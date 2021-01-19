import axios from 'axios'

// TODO: pagination when searching
export const searchBooksByTitle = input => {
	return axios.post('/books/search', { "value": input })
		.then(res => {
			console.log(res)
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

export const createBook = (data) => {
  console.log(data)
	return axios.post('/books/create', { data })
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


export const updateBook = (bookId, data) => {
	console.log(data)
	return axios.put('/books/' + bookId + '/update', { data })
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

export const deleteBook = (book_id) => {
	console.log(book_id)
	return axios.delete('/books/delete', { data: { book_id } })
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


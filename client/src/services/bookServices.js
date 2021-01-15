import axios from 'axios'

// TODO: pagination when searching
export const searchBooksByTitle = title => {
	let data = null
	return new Promise((resolve, reject) => {
		axios.post('/books/search', {"value": title})
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


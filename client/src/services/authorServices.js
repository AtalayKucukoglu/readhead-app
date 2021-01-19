import axios from "axios"

export const getAuthorById = async authorId => {
  return axios.get('/authors/' + authorId)
  .then(res => {
    if (res && res.data && res.data.status) {
      return res.data.data
    }
    else return null
  })
  .catch(err => console.log(err))
}

export const getAuthorBooks = async authorId => {
  return axios.get('/authors/' + authorId + '/books')
  .then(res => {
    if (res && res.data && res.data.status) {
      return res.data.data
    }
    else return null
  })
  .catch(err => console.log(err))
}

export const searchAuthorsByName = (input) => {
  return axios.post('/authors/search', {"value": input})
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

export const getBirthPlaceById = async id => {
  return axios.get('/birthplaces/' + id)
  .then(res => {
    if (res && res.data && res.data.status) {
      return res.data.data
    }
    else return null
  })
  .catch(err => console.log(err))
}

export const searchBirthPlace = (input) => {
  return axios.post('/birthplaces/search', {"value": input})
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

export const createAuthor = (data) => {
  console.log(data)
	return axios.post('/authors/create', { data })
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

export const updateAuthor = (authorId, data) => {
	console.log(data)
	return axios.put('/authors/' + authorId + '/update', { data })
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

export const deleteAuthor = (author_id) => {
	return axios.delete('/authors/delete', { data: { author_id } })
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



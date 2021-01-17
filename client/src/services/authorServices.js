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
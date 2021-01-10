
export const checkAuthorization = (response, history) => {
  let redirect = false
  if(!response) return true

  if (!response.status && (!response.authorized || !response.token_valid)) {
    redirect = true
  }
  if(redirect) {
    history.push('/login')
  }
  return !redirect
}
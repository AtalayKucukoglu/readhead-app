import { CircularProgress, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import RoundedImage from '../components/RoundedImage'
import pp from '../images/profile_picture.jpg'
import { getAllLists, getUserWithUsername } from '../services/userServices'
import { Alert } from '@material-ui/lab'
import { connect } from 'react-redux'
import { checkAuthorization, mapStateToProps } from '../helpers/helpers.js'
import { updateAllLists } from '../actions/userListsAction'

class ProfilePage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      visitedUser: null,    // user who's profile is being visited now
      error: false,
      errorMessage: '',
      isLoading: true,
    }
  }


  async componentDidMount() {
    console.log("props in profile page: ", this.props)
    console.log("state in profile page: ", this.state)
    if (!checkAuthorization(response, this.props.history)) return;
    this.getUserData()
  }

  getUserData = async () => {
    const defaultMessage = 'There is no such a user. Maybe typo in url?'
    const response = await getUserWithUsername(this.getParams().username)
    let visitedUser = {}
    // redirect to login if not authorized
    if (!response) {
      this.setState({ error: true, errorMessage: defaultMessage })
      return
    }
    if (!response.status) {
      this.setState({ error: true, errorMessage: response.message || defaultMessage })
    } else {
      visitedUser = response.data
      const listsData = await getAllLists(visitedUser.username)
      if (listsData) {
        this.props.dispatch(updateAllLists(listsData))
      }
    }

    this.setState({ isLoading: false, visitedUser })
  }

  render() {
    const { visitedUser, isLoading, error, errorMessage } = this.state;
    console.log("visited user: ", visitedUser)
    return (
      <div className='page-container jc-center'>
        {
          isLoading ? <CircularProgress color="primary" /> : null
        }
        {
          error ? <Alert severity='error'>{errorMessage}</Alert> : null
        }
        {
          visitedUser ? this.renderUserInfo() : null
        }
      </div>
    )
  }

  // renderer methods

  renderUserInfo = () => {
    const { username } = this.state.visitedUser;

    return (
      <div>
        <RoundedImage height={100} src={pp} alt={username} />
        <Typography variant='h4'>
          {username}
        </Typography>
        {this.renderLists()}
      </div>
    )
  }

  renderLists = () => {
    const { favorites, haveRead, toRead } = this.props



    let hasData = (list) => list && list.length > 0
    return (
      <div className='flex-column'>
        <Typography variant='h5'>
          Favorites
        </Typography>
        {
          !hasData(favorites) ? 
          <Typography variant='body2'>No books in the list.</Typography>
          :
          <div>
            {favorites.map(book => {
              return <Typography variant='body1'>{book.title}</Typography>
            })}
          </div>
        }
        <Typography variant='h5'>
          Wants To Read
        </Typography>
        {
          !hasData(toRead) ? 
          <Typography variant='body2'>No books in the list.</Typography>
          :
          <div>
            {toRead.map(book => {
              return <Typography variant='body1'>{book.title}</Typography>
            })}
          </div>
        }
        <Typography variant='h5'>
          Have Read
        </Typography>
        {
          !hasData(haveRead) ? 
          <Typography variant='body2'>No books in the list.</Typography>
          :
          <div>
            {haveRead.map(book => {
              return <Typography variant='body1'>{book.title}</Typography>
            })}
          </div>
        }
      </div>
    )
  }

  getParams = () => {
    return this.props.match.params
  }
}


export default connect(mapStateToProps)(ProfilePage)
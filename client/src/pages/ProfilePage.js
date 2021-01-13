import { CircularProgress, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import RoundedImage from '../components/RoundedImage'
import pp from '../images/profile_picture.jpg'
import { getUserLists, getUserWithUsername } from '../services/userServices'
import { Alert } from '@material-ui/lab'
import { connect } from 'react-redux'
import { checkAuthorization } from '../helpers/helpers.js'

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
    this.getUserData()
  }

  getUserData = async () => {
    const defaultMessage = 'There is no such a user. Maybe typo in url?'
    const response = await getUserWithUsername(this.getParams().username)
    let visitedUser = {}
    // redirect to login if not authorized
    if (!checkAuthorization(response, this.props.history)) return;
    if (!response) {
      this.setState({ error: true, errorMessage: defaultMessage })
      return
    }
    if (!response.status) {
      this.setState({ error: true, errorMessage: response.message || defaultMessage })
    } else {
      visitedUser = response.data
      const listsData = await getUserLists(this.getParams().username)
      if (listsData) {
        visitedUser.lists = listsData
      }
    }

    this.setState({ isLoading: false, visitedUser })
  }

  render() {
    const { visitedUser, isLoading, error, errorMessage } = this.state;
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
    const { lists } = this.state.visitedUser
    const { favorites, to_read, have_read } = lists || {}
    const listnames = {
      'favorites': 'Favorites',
      'to_read': 'Wants To Read',
      'have_read': 'Have Read',
    }
    let hasData = (list) => list && list.length > 0
    return (
      <div className='flex-column'>
        {
          Object.keys(lists).map(name => {
            const listname = listnames[name]
            return (
              <div key={name}>
                <Typography variant='h5'>
                  {listname}
                </Typography>
                {
                  hasData(lists[name]) ?
                  <div>
                    there are some books in this list
                  </div>
                  :
                  <div>
                    no data
                  </div>
                }
              </div>
            )
          })
        }

      </div>
    )
  }

  getParams = () => {
    return this.props.match.params
  }
}

const mapStateToProps = (state) => {
  console.log("profile page maps to props state: ", state)
  const { isAuthenticated, error, errorMessage, user } = state.auth;
  return {
    isAuthenticated,
    error,
    errorMessage,
    user
  }
}

export default connect(mapStateToProps)(ProfilePage)
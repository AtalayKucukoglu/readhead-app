import { CircularProgress, Grid, Typography } from '@material-ui/core'
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
    this.getUserData()
  }

  getUserData = async () => {
    const defaultMessage = 'There is no such a user. Maybe typo in url?'
    const response = await getUserWithUsername(this.getParams().username)
    let visitedUser = {}
    // redirect to login if not authorized
    // if (!checkAuthorization(response, this.props.history)) return;
    if (!response) {
      this.setState({ error: true, errorMessage: this.props.errorMessage || defaultMessage })
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
    const { visitedUser, isLoading } = this.state;
    const { isAuthenticated, errorMessage } = this.props
    console.log("visited user: ", visitedUser)

    if (!isAuthenticated) {
      return this.props.history.push('/login')
    }

    if (!visitedUser && !isLoading) {
      return (
        <div className='page-container jc-center'>
          <Alert severity='error'>{errorMessage || "There is no such user: " + this.getParams().username}</Alert>
        </div>
      )
    }


    return (
      <div className='page-container jc-center ai-center'>
        {
          isLoading ? <CircularProgress color="primary" /> :
            <Grid container spacing={2} direction='row'>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                {this.renderUserInfo()}
                {this.renderGoalInfo()}
              </Grid>
              <Grid xs={12} md={6}>
                {this.renderLists()}
              </Grid>
            </Grid>
        }
      </div>
    )
  }

  // renderer methods

  renderUserInfo = () => {
    const { visitedUser } = this.state;
    if (!visitedUser) return null;
    const { username } = visitedUser
    return (
      <div className='flex-column ai-center'>
        <RoundedImage height={100} src={pp} alt={username} />
        <Typography variant='h4'>
          {username}
        </Typography>
      </div>
    )
  }

  renderLists = () => {
    const { favorites, haveRead, toRead } = this.props

    let hasData = (list) => list && list.length > 0
    return (
      <div className='flex-column ai-center'>
        <div className='ai-fs'>
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
      </div>
    )
  }

  renderGoalInfo = () => {
    const { visitedUser } = this.state;
    if (!visitedUser) return null
    const { goal_book_count, goal_start_date, goal_end_date } = visitedUser
    return (
      <div className='flex-column ai-center'>
        <Typography variant='h5'>
          Goals
        </Typography>
        {
          !goal_book_count ? <Typography variant='body2'>No goals</Typography>
            :
            <div>
              <Typography variant='body1'>
                Goal Book Count: {goal_book_count}
              </Typography>
              <Typography variant='body1'>
                Goal Start Date: {goal_start_date}
              </Typography>
              <Typography variant='body1'>
                Goal End Date: {goal_end_date}
              </Typography>
              <Typography variant='body1'>
                Progress: unknown
              </Typography>
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
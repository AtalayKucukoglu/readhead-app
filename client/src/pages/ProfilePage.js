import { CircularProgress, Grid, Link, TextField, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import RoundedImage from '../components/RoundedImage'
import pp from '../images/profile_picture.jpg'
import { getAllLists, getUserWithUsername, updateGoal } from '../services/userServices'
import { Alert } from '@material-ui/lab'
import { connect } from 'react-redux'
import { checkAuthorization, mapStateToProps } from '../helpers/helpers.js'
import { updateAllLists } from '../actions/userListsAction'
import CreateEntityModal from '../components/CreateEntityModal'
import { green } from '@material-ui/core/colors'
import UserForm from '../components/forms/UserForm'
import GoalForm from '../components/forms/GoalForm'
import DeleteModalButton from '../components/DeleteModalButton'

class ProfilePage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      visitedUser: null,    // user who's profile is being visited now
      visitedLists: {},
      error: false,
      errorMessage: '',
      isLoading: true,
      isUsersOwnProfile: false,

      // goals
      goalsModalOpen: false,
      goalSaving: false,
    }
  }


  componentDidMount() {
    console.log("comp did mount props: ", this.props)
    if (this.props.isAuthenticated) {
      this.fetchUserData()
      this.fetchListsData()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("comp did update")
    if (!prevProps.isAuthenticated && this.props.isAuthenticated) {
      this.fetchUserData()
      this.fetchListsData()
    }
    // if visited user is changed
    if (prevState.visitedUser && prevState.visitedUser.username !== this.getParams().username) {
      this.fetchUserData()
      this.fetchListsData()
    }
  }

  fetchUserData = async () => {
    console.log("getting visited user data...")
    const visitedUsername = this.getParams().username
    const defaultMessage = 'There is no such a user. Maybe typo in url?'

    // if this page is authenticated user's profile
    if (visitedUsername === this.props.user.username && !this.state.isUsersOwnProfile) {
      this.setState({ isLoading: false, visitedUser: this.props.user, isUsersOwnProfile: true })
      return
    }
    // get visited user's data
    const visitedUser = await getUserWithUsername(visitedUsername)
    if (!visitedUser) {
      this.setState({ error: true, errorMessage: this.props.errorMessage || defaultMessage })
    }
    this.setState({ isLoading: false, visitedUser })
  }

  fetchListsData = async () => {
    const visitedUsername = this.getParams().username
    const visitedLists = await getAllLists(visitedUsername)
    if (visitedLists) {
      if (visitedUsername === this.props.user.username) {
        this.props.dispatch(updateAllLists(visitedLists))
      }
      this.setState({ visitedLists })
    }
  }

  render() {
    const { visitedUser, isLoading, isUsersOwnProfile } = this.state;
    const { isAuthenticated, errorMessage } = this.props
    console.log("visited user: ", visitedUser)
    console.log("visited user lists: ", this.state.visitedLists)
    console.log(this.state)
    console.log("props: ", this.props)
    console.log(this.getParams())

    if (!isAuthenticated && !isLoading) {
      console.log("redirect to login")
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
              <Grid item xs={12} md={6}>
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
    const { username, email, gender, birth_date } = visitedUser
    return (
      <div className='flex-column ai-center'>
        <RoundedImage height={100} src={pp} alt={username} />
        <Typography variant='h4'>{username}</Typography>
        <Typography variant='body1'>{email}</Typography>
        <Typography variant='body1'>{gender}</Typography>
        <Typography variant='body1'>{birth_date}</Typography>
        {
          !this.state.isUsersOwnProfile ? null :
            <div>
              <UserForm mode='update' user={this.props.user} title='Edit Author' style={{ color: green[500] }} text='Edit Info' />
              <DeleteModalButton mode='user' item={this.props.user} title='Confirm Delete' text='Delete Your Account' history={this.props.history} />
            </div>
        }

      </div>
    )
  }

  renderLists = () => {
    const { favorites, haveRead, toRead } = this.state.isUsersOwnProfile ? this.props : this.state.visitedLists

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
              <div className='flex-column ai-fs'>
                {favorites.map(book => {
                  return <Typography className='cursor-pointer' component={Link} color='inherit' onClick={() => this.props.history.push('/books/' + book.book_id)} variant='body1'>{book.title}</Typography>
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
              <div className='flex-column ai-fs'>
                {toRead.map(book => {
                  return <Typography className='cursor-pointer' component={Link} color='inherit' onClick={() => this.props.history.push('/books/' + book.book_id)} variant='body1'>{book.title}</Typography>
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
              <div className='flex-column ai-fs'>
                {haveRead.map(book => {
                  return <Typography className='cursor-pointer' component={Link} color='inherit' onClick={() => this.props.history.push('/books/' + book.book_id)} variant='body1'>{book.title}</Typography>
                })}
              </div>
          }
        </div>
      </div>
    )
  }

  renderGoalInfo = () => {
    const { visitedUser, isUsersOwnProfile } = this.state;
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
            </div>
        }
        {
          !isUsersOwnProfile ? null :
            <GoalForm mode='update' data={this.state.visitedUser} title='Edit Goal' style={{ color: green[500] }} text='Edit Goal' />
        }
      </div>
    )
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value
    })
  }

  getParams = () => {
    return this.props.match.params
  }

  responseReceived = () => {
    return this.props.isAuthenticated || this.props.error || this.props.user.username
  }
}


export default connect(mapStateToProps)(ProfilePage)
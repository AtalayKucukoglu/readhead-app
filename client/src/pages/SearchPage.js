import { IconButton, Paper, TextField, Typography, Link } from '@material-ui/core'
import { green, yellow, red, grey } from '@material-ui/core/colors'
import React, { Component } from 'react'
import { searchBooksByTitle } from '../services/bookServices'
import { Favorite, Star, CheckCircle } from '@material-ui/icons';
import { mapStateToProps } from '../helpers/helpers.js'
import { connect } from 'react-redux';
import { getAllLists } from '../services/userServices';
import { addToList, deleteFromList, updateAllLists, UPDATE_LIST_OPERATIONS } from '../actions/userListsAction';

const { UPDATE_FAVORITES, UPDATE_HAVE_READ, UPDATE_TO_READ } = UPDATE_LIST_OPERATIONS

class SearchPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: '',
      results: []
    }
  }

  // fired when new props arrive
  componentDidUpdate(prevProps, prevState) {
    // check if user prop is updated. if updated, fetch user's lists
    if (!prevProps.user.username && this.props.user.username && this.props.isAuthenticated) {
      this.fetchLists()
    }
  }

  fetchLists = async () => {
    const listsData = await getAllLists(this.props.user.username)
    if (listsData) {
      this.props.dispatch(updateAllLists(listsData))
    }
  }

  render() {
    const { isAuthenticated } = this.props
    // if not authenticated user, redirect to login
    if (!isAuthenticated) {
      this.props.history.push('/login')
    }
    return (
      <div className='page-container ai-center flex-column'>
        {
          !isAuthenticated ? "Oooppss! You were never here..." : null
        }
        <div>
          <Typography variant='h3' className='mb-1'>Search</Typography>
        </div>
        <TextField style={{ width: '80%', }} className='mb-1' required variant='outlined' label='Search' type='Search Books'
          placeholder='start typing a title' value={this.state.search} onChange={ev => this.handleSearchChange(ev.target.value)} />
        {this.renderAddBook()}
        {this.renderResults()}
      </div>
    )
  }

  renderResults = () => {
    if (this.state.results.length < 1) return
    const { username } = this.props.user;
    const { dispatch } = this.props
    return (
      <div className='my-1 flex-column' style={{ width: '80%' }}>
        {this.state.results.map(book => {
          const isFavorite = this.props.favorites.some(b => b.book_id === book.book_id)
          const isRead = this.props.haveRead.some(b => b.book_id === book.book_id)
          const isWanted = this.props.toRead.some(b => b.book_id === book.book_id)
          return (
            <Paper key={book.book_id} elevation={3} onClick={() => { }} className='flex-row mb-1 px-1 py-1 jc-sb ai-fs' >
              <div className='flex-column' style={{ width: '70%', }}>
                <Typography variant='h5'>{book.title}</Typography>
                <Typography variant='subtitle1'>{book.name}</Typography>
                <Typography variant='subtitle2'>{book.publish_date} - {book.pages} pages</Typography>
              </div>
              <div className='flex-row' style={{ width: '30%', }}>
              <IconButton onClick={() => !isRead ? dispatch(addToList(username, book.book_id, UPDATE_HAVE_READ))
                : dispatch(deleteFromList(username, book.book_id, UPDATE_HAVE_READ)) }>
                  <div className='flex-column ai-center' >
                    <CheckCircle style={{ color: isRead ? green[500] : grey[500] }} />
                    <Typography variant='subtitle2'>Read</Typography>
                  </div>
                </IconButton>
                <IconButton onClick={() => !isWanted ? dispatch(addToList(username, book.book_id, UPDATE_TO_READ))
                : dispatch(deleteFromList(username, book.book_id, UPDATE_TO_READ)) }>
                  <div className='flex-column ai-center'>
                    <Favorite  style={{ color: isWanted ? red[500] : grey[500] }} />
                    <Typography variant='subtitle2'>Want To</Typography>
                  </div>
                </IconButton>
                <IconButton onClick={() => !isFavorite ? dispatch(addToList(username, book.book_id, UPDATE_FAVORITES))
                : dispatch(deleteFromList(username, book.book_id, UPDATE_FAVORITES)) }>
                  <div className='flex-column ai-center'>
                    <Star style={{ color: isFavorite ? yellow[500] : grey[500] }} />
                    <Typography variant='subtitle2'>Favorite</Typography>
                  </div>
                </IconButton>
              </div>
            </Paper>
          )
        })}
      </div>
    )
  }

  renderAddBook = () => {
    const searchable = this.state.search.length > 3
    if (!searchable) return null
    return (
      <div className='py-1'>
        <Typography variant='body1'>
          <Link href='/add' style={{ color: green[500] }} >Couldn't find what you want? Add another a book instead!</Link>
        </Typography>
      </div>
    )
  }

  handleSearchChange = input => {
    this.setState({ search: input })
    this.fetchResults(input)
  }

  fetchResults = async input => {
    if (input.length < 4) return
    const results = await searchBooksByTitle(input)
    if (!results) {
      this.setState({ error: true, errorMessage: 'An error happened. Please try again later.', results: [] })
    }
    this.setState({ results })
  }
}



export default connect(mapStateToProps)(SearchPage)
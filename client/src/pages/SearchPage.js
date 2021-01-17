import { TextField, Typography, Link, Radio, FormControl, FormControlLabel, RadioGroup, } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import React, { Component } from 'react'
import { searchBooksByTitle } from '../services/bookServices'
import { mapStateToProps } from '../helpers/helpers.js'
import { connect } from 'react-redux';
import { getAllLists } from '../services/userServices';
import { updateAllLists } from '../actions/userListsAction';
import ListItem from '../components/ListItem';
import { searchAuthorsByName } from '../services/authorServices'

const placeholders = {
  'books': 'start typing a title...',
  'authors': 'start typing an author\'s name',
}

class SearchPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: '',
      results: [],
      searchMode: 'books',
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
    const { searchMode } = this.state
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
        <TextField style={{ width: '80%', }} className='mb-1' variant='outlined' label='Search' type='Search Books'
          placeholder={placeholders[searchMode]} value={this.state.search} onChange={ev => this.handleSearchChange(ev.target.value)} />
        <FormControl component="fieldset">
          <RadioGroup row name="searchModeSelect" value={searchMode} onChange={(ev) => this.handleSearchModeChange(ev.target.value)}>
            <FormControlLabel value="books" control={<Radio color='primary' />} label="Books" />
            <FormControlLabel value="authors" control={<Radio color='primary' />} label="Authors" />
          </RadioGroup>
        </FormControl>
        {this.renderAddItem()}
        {this.renderResults()}
      </div>
    )
  }

  renderResults = () => {
    if (!this.state.results) return
    if (this.state.results.length < 1) return
    console.log(this.state.results)
    const { username } = this.props.user;
    const { searchMode } = this.state
    console.log(searchMode)
    return (
      <div className='my-1 flex-column' style={{ width: '80%' }}>
        {searchMode === 'books' ? this.state.results.map(book => {
          const isFavorite = this.props.favorites.some(b => b.book_id === book.book_id)
          const isRead = this.props.haveRead.some(b => b.book_id === book.book_id)
          const isWanted = this.props.toRead.some(b => b.book_id === book.book_id)
          return (
            <ListItem
              mode='book'
              username={username}
              isRead={isRead}
              isFavorite={isFavorite}
              isWanted={isWanted}
              item={book}
              history={this.props.history}
              icons={true} />
          )
        })
          : searchMode === 'authors' ?
            this.state.results.map(author => {
              return (
                <ListItem
                  mode='author'
                  item={author}
                  username={username}
                  history={this.props.history}
                  icons={false} />
              )
            })
            : null
        }
      </div>
    )
  }

  renderAddItem = () => {
    const searchable = this.state.search.length > 3
    if (!searchable) return null
    return (
      <div className='py-1'>
        <Typography variant='body1'>
          <Link href='/add' style={{ color: green[500] }} >Couldn't find what you want? Add another book instead!</Link>
        </Typography>
      </div>
    )
  }

  handleSearchModeChange = (searchMode) => {
    console.log(searchMode)
    this.setState({searchMode, results: [], search: ''})
  }

  handleSearchChange = input => {
    this.setState({ search: input })
    this.fetchResults(input)
  }

  fetchResults = async input => {
    if (input.length < 4) return
    const results = this.state.searchMode === 'books' ? await searchBooksByTitle(input) : await searchAuthorsByName(input)
    if (!results) {
      this.setState({ error: true, errorMessage: 'An error happened. Please try again later.', results: [] })
    }
    this.setState({ results })
  }
}



export default connect(mapStateToProps)(SearchPage)
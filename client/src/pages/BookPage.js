import { CircularProgress, Link, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { Component } from 'react'
import { getBookById } from '../services/bookServices'
import BookForm from '../components/forms/BookForm'
import { green } from '@material-ui/core/colors'
import DeleteModalButton from '../components/DeleteModalButton'


export default class BookPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      book: null
    }
  }


  componentDidMount() {
    console.log(this.props)
    this.fetchBookData()
  }

  fetchBookData = async () => {
    const book = await getBookById(this.getParams().bookId)
    if (book) {
      this.setState({ book, isLoading: false })
    }
    else {
      this.setState({ isLoading: false, error: true, errorMessage: "An error occured." })
    }
  }

  render() {
    const { book, isLoading, error, errorMessage } = this.state;
    const { isAuthenticated } = this.props;
    console.log(book)

    return (
      <div className='page-container jc-center ai-center'>
        {
          !isLoading ? null :
            <div className='page-container jc-center ai-center'>
              <CircularProgress color="primary" />
            </div>
        }
        { !book && !isLoading ?
          <Alert severity='error'>Could not find book.</Alert> :
          <div>
            {this.renderBook()}
          </div>
        }
      </div>
    )
  }

  renderBook = () => {
    if (!this.state.book) return null
    const { book_id, title, publish_date, pages, name, author_id, publish_place, publisher } = this.state.book
    return (
      <div key={book_id}>
        <Typography variant='h3'>{title}</Typography>
        <Typography className='cursor-pointer' component={Link} color='inherit' onClick={() => this.props.history.push('/authors/' + author_id)}  variant='h4'>By {name}</Typography>
        <Typography variant='h5'>{pages} pages</Typography>
        <Typography variant='h6'>Published at: {publish_date} {publish_place}</Typography>
        <Typography variant='h6'>Publisher: {publisher || "unknown"}</Typography>
        <BookForm mode='update' book={this.state.book} title='Edit Book' style={{color: green[500]}} text='Edit Book' />
        <hr/>
        <DeleteModalButton mode='book' item={this.state.book} title='Confirm Delete' text='Delete This Book' history={this.props.history} />
      </div>
    )
  }

  getParams = () => {
    console.log(this.props.match.params)
    return this.props.match.params
  }
}


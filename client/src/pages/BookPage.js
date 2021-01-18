import { CircularProgress, Grid, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { Component } from 'react'
import { getBookById } from '../services/bookServices'
import BookForm from '../components/forms/BookForm'
import { green } from '@material-ui/core/colors'


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
    const { book_id, title, publish_date, pages, name } = this.state.book
    return (
      <div key={book_id}>
        <Typography variant='h3'>{title}</Typography>
        <Typography variant='h4'>By {name}</Typography>
        <Typography variant='h5'>{pages} pages</Typography>
        <Typography variant='h6'>Published at: {publish_date}</Typography>
        <BookForm mode='update' book={this.state.book} title='Edit Author' style={{color: green[500]}} text='Edit Book' />
      </div>
    )
  }

  getParams = () => {
    console.log(this.props.match.params)
    return this.props.match.params
  }
}


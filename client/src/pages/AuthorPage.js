import { Button, CircularProgress, Divider, Grid, Link, Typography } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { Alert } from '@material-ui/lab'
import React, { Component } from 'react'
import AuthorForm from '../components/forms/AuthorForm'
import { getAuthorBooks, getAuthorById } from '../services/authorServices'

const genders = { 'M': 'Male', 'F': 'Female' }

export default class AuthorPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      author: null,
      books: null,
    }
  }


  componentDidMount() {
    console.log(this.props)
    this.fetchAuthorData()
    this.fetchAuthorBooks()
  }

  fetchAuthorData = async () => {
    const author = await getAuthorById(this.getParams().authorId)
    if (author) {
      this.setState({ author, isLoading: false })
    }
    else {
      this.setState({ isLoading: false, error: true, errorMessage: "An error occured." })
    }
  }

  fetchAuthorBooks = async () => {
    const books = await getAuthorBooks(this.getParams().authorId)
    if (books) {
      this.setState({ books, isLoading: false })
    }
    else {
      this.setState({ isLoading: false, error: true, errorMessage: "An error occured." })
    }
  }

  render() {
    const { author, isLoading, error, errorMessage } = this.state;
    const { isAuthenticated } = this.props;
    console.log(author)

    return (
      <div className='page-container jc-center ai-center'>
        {
          !isLoading ? null :
            <div className='page-container jc-center ai-center'>
              <CircularProgress color="primary" />
            </div>
        }
        { !author && !isLoading ?
          <Alert severity='error'>Could not find author.</Alert> :
          <Grid container spacing={5} className='mx-1'>
            {this.renderAuthor()}
            {this.renderBooks()}
          </Grid>
        }
      </div>
    )
  }

  renderAuthor = () => {
    if (!this.state.author) return null
    const { author_id, name, birthplace, gender, birth_date, death_date } = this.state.author
    return (
      <Grid item xs={12} md={6} >
        <Typography variant='h3'>{name}</Typography>
        <Typography variant='h4'>Born in {birthplace}</Typography>
        <Typography variant='h5'>{genders[gender.trim()] || gender.trim()}</Typography>
        <Typography variant='h6'>Birth Date: {birth_date || "unknown"}</Typography>
        <Typography variant='h6'>Death Date: {death_date || "unknown"}</Typography>
        <AuthorForm mode='update' author={this.state.author} title='Edit Author' style={{color: green[500]}} text='Edit Author' />
      </Grid>
    )
  }

  renderBooks = () => {
    if (!this.state.author) return
    const { books } = this.state
    const hasData = list => list.length > 0
    return (
      <Grid item xs={12} md={6}>
        <Typography variant='h4'>Books of {this.state.author.name}</Typography>
        <hr/>
        {
          !books || !hasData(books) ? "This author has no books." :
            books.map((b,index) => {
              return (
                <div key={b.book_id}>
                  <Typography className='cursor-pointer' component={Link} color='inherit' onClick={() => this.props.history.push('/books/' + b.book_id)} variant='h5'>{b.title}</Typography>
                  <Typography variant='h6'>{b.pages} pages</Typography>
                  <Typography variant='h6'>Published at: {b.publish_date}</Typography>
                  {index < books.length - 1 ? <Divider /> : null}
                </div>
              )
            })
        }
      </Grid>
    )
  }

  getParams = () => {
    console.log(this.props.match.params)
    return this.props.match.params
  }
}


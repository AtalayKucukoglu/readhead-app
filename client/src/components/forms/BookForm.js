import { Button, TextField, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import React, { Component } from 'react'
import { searchAuthorsByName } from '../../services/authorServices'
import { createBook, updateBook } from '../../services/bookServices'
import CreateEntityModal from '../CreateEntityModal'


export default class BookForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      isSaving: false,
      authorInput: '',
      authorResults: [],
      author: null, 
    }
  }

  componentDidMount() {
    console.log(this.props.book)
    if (this.props.mode === 'update' && this.props.book) {
      const { author_id, name } = this.props.book
      this.setState({
        ...this.props.book,
        author: {author_id, name}
      })
    }
  }

  render() {
    return (
      <div className='my-1'>
        <Button style={this.props.style} onClick={this.handleOpen} >
          <Typography variant='body1'>
            {this.props.text}
          </Typography>
        </Button>
        <CreateEntityModal
          isOpen={this.state.isOpen}
          isSaving={this.state.isSaving}
          title={this.props.title}
          onSave={this.handleSave}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
        >
          {this.renderForm()}
        </CreateEntityModal>
      </div>
    )
  }

  renderForm = () => {
    return (
      <div className='flex-column mx-1 px-1' style={{ width: '90vw', maxWidth: '400px' }}>
        <TextField className='mb-1' name='title' label='Book Title' type='text' variant='outlined'
          value={this.state.title} onChange={this.handleChange} />
        <Autocomplete
          value={this.state.author}
          onChange={(ev, newVal) => this.setState({ author: newVal })}
          inputValue={this.state.authorInput}
          onInputChange={(ev, newVal) => this.handleAuthorInputChange(newVal)}
          options={this.state.authorResults}
          getOptionLabel={(option) => option.name}
          style={{ width: '300' }}
          renderInput={(params) => <TextField {...params} label="Author" placeholder='start typing name...' type='text' variant="outlined" />}
        />
        <TextField className='mb-1' variant='outlined' label='Pages' type='number' name='pages'
          value={this.state.pages} onChange={this.handleChange} />
        <TextField required className='mb-1' InputLabelProps={{ shrink: true }} variant='outlined' label='Publish Date'
          type='date' name='publish_date' value={this.state.publish_date} onChange={this.handleChange} />
      </div>
    )
  }

  searchAuthors = async (input) => {
    if(input.length < 4) {
      this.setState({ authorResults: [] })
    }
    const result = await searchAuthorsByName(input)
    if (result) {
      this.setState({ authorResults: result })
    }
  }

  handleAuthorInputChange = (input) => {
    this.setState({authorInput: input});
    this.searchAuthors(input)
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value
    })
  }

  handleSave = async () => {
    const { title, publish_date, pages, book_id , author_id, author} = this.state
    const { mode } = this.props
    this.setState({ isSaving: true })
    let data = { title, publish_date, pages }; // only book related data
    // if author is changed, add author_id to the data
    // backend server only updates new author if author id is sent
    if (author_id !== author.author_id) data = {...data, 'author_id': author.author_id}
    const response = mode === 'update' ? await updateBook(book_id, data) : await createBook(data)
    console.log(response)
    if (response && response.status) {
      this.setState({ saved: true })
      if (mode === 'create' && response.book_id) {
        this.props.history.push('/books/' + response.book_id)
      }
    }
    this.handleClose()
  }

  handleOpen = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }
}

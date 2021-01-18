import { Button, TextField, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import { updateBook } from '../../services/bookServices'
import CreateEntityModal from '../CreateEntityModal'


export default class BookForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      isSaving: false,
    }
  }

  componentDidMount() {
    if (this.props.mode === 'update' && this.props.book) {
      // const { title, publish_date, pages, book_id } = this.props.book
      console.log(this.props.book)
      this.setState({
        ...this.props.book,
      })
    }
  }

  render() {
    console.log(this.state)
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
        <TextField className='mb-1' variant='outlined' label='Pages' type='number' name='pages'
          value={this.state.pages} onChange={this.handleChange} />
        {/* <TextField required className='mb-1' InputLabelProps={{ shrink: true }} variant='outlined' label='Publish Date'
          type='date' name='publish_date' value={this.state.publish_date} onChange={this.handleChange} /> */}
      </div>
    )
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value
    })
  }

  handleSave = async () => {
    const { title, publish_date, pages, book_id } = this.state
    this.setState({ isSaving: true })
    const updated = { title, publish_date, pages };
    const status = await updateBook(book_id, updated)
    if (status) {
      this.setState({ isSaving: false, saved: true })
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

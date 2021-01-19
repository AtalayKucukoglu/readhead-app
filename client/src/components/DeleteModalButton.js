import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core'
import { red } from '@material-ui/core/colors';
import React, { Component } from 'react'
import { deleteAuthor } from '../services/authorServices';
import { deleteBook } from '../services/bookServices';
import { deleteUser } from '../services/userServices';
import LoadingIcon from './LoadingIcon';

export default class DeleteModalButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      isSaving: false,
    }
  }

  render() {
    const { text } = this.props;
    return (
      <div className='my-1'>
        <Button style={this.props.style} onClick={this.handleOpen} color='secondary'>
          <Typography variant='body1'>
            {text}
          </Typography>
        </Button>
        {this.renderDeleteConfirmModal()}
      </div>
    )
  }

  renderDeleteConfirmModal = () => {
    const { isOpen, isSaving } = this.state;
    const { title, } = this.props;

    return (
      <Dialog
        open={isOpen}
        onClose={this.handleClose}
        maxWidth='md' >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography className='mb-1 mx-1' variant='body1'>Are you sure you want to delete this?</Typography>
          {this.renderItem()}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDeleteConfirm} color="secondary">
            {isSaving ? <LoadingIcon size='sm' color={red[500]} /> : "Delete"}
          </Button>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  renderItem = () => {
    const { mode, item } = this.props;
    const itemName = mode === 'book' ? item.title : mode === 'author' ? item.name : mode === 'user' ? item.username : null
    const secondaryInfo = mode === 'book' ? "Publish date: " + item.publish_date : mode === 'author' ? "From: " + item.birthplace : mode === 'user' ? item.email : null
    return (
      <div className='flex-column ai-center my-1'>
        <Typography variant='h6'>{itemName}</Typography>
        <Typography variant='body1'>{secondaryInfo}</Typography>
      </div>
    )
  }

  handleDeleteConfirm = async () => {
    console.log(this.props)
    this.setState({isSaving: true})
    const { mode, item } = this.props;
    const id = mode === 'book' ? item.book_id : mode === 'author' ? item.author_id : mode === 'user' ? item.user_id : null
    console.log(id)
    // delete by id
    const response = mode === 'book' ? await deleteBook(id) : mode === 'author' ? await deleteAuthor(id) : mode === 'user' ? await deleteUser(id) : null
    if(response) {
      mode === 'user' ? this.props.history.push('/login') : this.props.history.push('/search')
    }
    this.handleClose()
  } 
  
  handleOpen = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false, isSaving: false })
  }
}

import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import LoadingIcon from './LoadingIcon'

export default class CreateEntityModal extends Component {

  render() {
    const { isOpen, isSaving, title, display, displayProps, displayText } = this.props
    return (
      <div>
        {display === 'button' ?
          <Button variant='contained' color='primary' onClick={this.handleOpen}>
            {displayText}
          </Button> :
          display === 'link' ? 
          <Typography component={Link} {...displayProps}>
            {displayText}
          </Typography>
          : null
      }
        <Dialog
          open={isOpen}
          onClose={this.handleClose}
          maxWidth='md' >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            {this.props.children}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSave} color="primary">
              { isSaving ? <LoadingIcon size='sm' color='primary' /> : "Save" }
          </Button>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Cancel
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
  

  handleOpen = () => {
    this.props.onOpen()
  }

  handleClose = () => {
    this.props.onClose()
  }

  handleSave = () => {
    this.props.onSave()
  }
}

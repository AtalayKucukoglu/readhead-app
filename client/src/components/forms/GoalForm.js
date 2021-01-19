import { Button, TextField, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import { updateGoal } from '../../services/userServices'
import CreateEntityModal from '../CreateEntityModal'

export default class GoalForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      isSaving: false,
    }
  }

  componentDidMount() {
    if (this.props.mode === 'update' && this.props.data) {
      console.log(this.props.data)
      this.setState({
        ...this.props.data,
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
        <TextField required className='mb-1' name='goal_book_count' label='Goal Book Count' type='number' variant='outlined'
          value={this.state.goal_book_count} onChange={this.handleChange} />
        <TextField required className='mb-1' InputLabelProps={{ shrink: true }} variant='outlined' label='Start Date'
          type='date' name='goal_start_date' value={this.state.goal_start_date} onChange={this.handleChange} />
        <TextField required className='mb-1' InputLabelProps={{ shrink: true }} variant='outlined' label='Start Date'
          type='date' name='goal_end_date' value={this.state.goal_end_date} onChange={this.handleChange} />
      </div>
    )
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value
    })
  }

  handleSave = async () => {
    const { username, goal_book_count, goal_start_date, goal_end_date } = this.state
    this.setState({ isSaving: true })
    const updated = { goal_book_count, goal_start_date, goal_end_date };
    const status = await updateGoal(username, updated)
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

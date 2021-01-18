import { Button, MenuItem, TextField, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import { getDateFormatted } from '../../helpers/helpers'
import { updateUserInfo } from '../../services/userServices'
import CreateEntityModal from '../CreateEntityModal'

const genders = ['Male', 'Female']
const genderMap = { 'M': 'Male', 'F': 'Female' }

export default class UserForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      isSaving: false,
    }
  }

  componentDidMount() {
    if (this.props.mode === 'update' && this.props.user) {
      const { gender } = this.props.user
      console.log(this.props.user)
      this.setState({
        ...this.props.user,
        gender: genderMap[gender] || gender,
        hashed_password: undefined
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
        <TextField className='mb-1' required variant='outlined' label='Email' type='email' name='email'
              value={this.state.email} onChange={this.handleChange} />
            <TextField className='mb-1' required variant='outlined' label='Username' type='text' name='username'
              value={this.state.username} onChange={this.handleChange} />
            {/* <TextField className='mb-1' required variant='outlined' label='Password' type='password' name='password'
              value={this.state.password} onChange={this.handleChange} /> */}
            <TextField className='mb-1' select variant='outlined' label='Gender' type='text' name='gender'
              value={this.state.gender} onChange={this.handleChange} >
              {genders.map(option =>
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>)}
            </TextField>
            {/* <TextField className='mb-1' InputLabelProps={{ shrink: true }} variant='outlined' label='Birthdate'
              type='date' name='birthdate' value={this.state.birthdate} onChange={this.handleChange} /> */}
      </div>
    )
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value
    })
  }

  handleSave = async () => {
    const { username, birth_date, gender, email, user_id } = this.state
    this.setState({ isSaving: true })
    const updated = {  username, birth_date, gender, email, user_id };
    const status = await updateUserInfo(username, updated)
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

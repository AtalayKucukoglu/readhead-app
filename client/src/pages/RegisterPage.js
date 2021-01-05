import { Button, Grid, MenuItem, TextField, Typography, Link } from '@material-ui/core'
import React, { Component } from 'react'


const genders = ['Male', 'Female']

export default class LoginPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      username: '',
      password: '',
      gender: '',
      birthdate: '',
    }
  }

  render() {
    return (
      <div className='page-container jc-center ai-center'>
        <Grid item className='px-1 py-1' xs={8} s={6} md={6} lg={4} xl={3}>
          <Typography variant='h3' >
            Register
        </Typography>
          <form className='flex-column my-1'>
            <TextField className='mb-1' required variant='outlined' label='Email' type='email'
              value={this.state.email} onChange={ev => this.handleEmailChange(ev.target.value)} />
            <TextField className='mb-1' required variant='outlined' label='Username' type='text'
              value={this.state.username} onChange={ev => this.handleUsernameChange(ev.target.value)} />
            <TextField className='mb-1' required variant='outlined' label='Password' type='password'
              value={this.state.password} onChange={ev => this.handlePasswordChange(ev.target.value)} />
            <TextField className='mb-1' select variant='outlined' label='Gender' type='text'
              value={this.state.gender} onChange={ev => this.handleGenderChange(ev.target.value)} >
              {genders.map(option =>
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>)}
            </TextField>
            <TextField className='mb-1' InputLabelProps={{ shrink: true }} variant='outlined' label='Birthdate' type='date'
              value={this.state.birthdate} onChange={ev => this.handleBirthdateChange(ev.target.value)} />
          </form>
          <div className='jc-center flex-column' >
            <Button className='mb-1' color='primary' variant='contained'  >Register</Button>
            <Link variant='body1' href='/login' >
              Already registered? Login here.
            </Link>
          </div>
        </Grid>
      </div>
    )
  }

  handleEmailChange = (value) => {
    this.setState({ email: value })
    console.log('email changed: ', value)
  }

  handleUsernameChange = (value) => {
    this.setState({ username: value })
    console.log('username changed: ', value)
  }

  handlePasswordChange = (value) => {
    this.setState({ password: value })
    console.log('password changed: ', value)
  }

  handleGenderChange = (value) => {
    this.setState({ gender: value })
    console.log('gender changed: ', value)
  }

  handleBirthdateChange = (value) => {
    this.setState({ birthdate: value })
    console.log('birthdate changed: ', value)
  }
}

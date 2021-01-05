import { Button, Grid, TextField, Typography, Link } from '@material-ui/core'
import React, { Component } from 'react'


export default class LoginPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
    }
  }

  render() {
    return (
      <div className='page-container jc-center ai-center'>
        <Grid item className='px-1 py-1' xs={8} s={6} md={6} lg={4} xl={3}>
          <Typography variant='h3' >
            Login
        </Typography>
          <form className='flex-column my-1'>
            <TextField className='mb-1' required variant='outlined' label='Username' type='text'
              value={this.state.username} onChange={ev => this.handleUsernameChange(ev.target.value)} />
            <TextField className='mb-1' required variant='outlined' label='Password' type='password'
              value={this.state.password} onChange={ev => this.handlePasswordChange(ev.target.value)} />
          </form>
          <div className='jc-center flex-column' >
            <Button className='mb-1' color='primary' variant='contained'  >Login</Button>
            <Link variant='body1' href='/register' >
              Not registered yet? Register now!
            </Link>
          </div>
        </Grid>
      </div>
    )
  }

  handleUsernameChange = (value) => {
    this.setState({ username: value })
    console.log('username changed: ', value)
  }

  handlePasswordChange = (value) => {
    this.setState({ password: value })
    console.log('password changed: ', value)
  }

  handleLogin = () => {

  }
}

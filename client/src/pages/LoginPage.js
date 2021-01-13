import { Button, Grid, TextField, Typography, Link, CircularProgress } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { Component } from 'react'
import { connect } from "react-redux";
import { login, logout } from "../actions/authAction";

class LoginPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      username: '',
      password: '',
    }
  }

  componentDidMount() {
    this.props.dispatch(logout());
  }

  render() {
    const { isAuthenticated, error, errorMessage } = this.props
    const { isLoading } = this.state

    if (isAuthenticated) {
      this.props.history.push("/users/" + this.props.user.username)
    }

    if (this.responseReceived() && isLoading) this.setState({ isLoading: false })

    return (
      <div className='page-container jc-center ai-center'>
        <Grid item className='px-1 py-1' xs={8} s={6} md={6} lg={4} xl={3}>
          <Typography variant='h3' >
            Login
        </Typography>
          {
            !error ? null :
              <Alert severity="error">{errorMessage}</Alert>
          }
          <form className='flex-column my-1'>
            <TextField className='mb-1' required variant='outlined' label='Username' type='text'
              value={this.state.username} onChange={ev => this.handleUsernameChange(ev.target.value)} />
            <TextField className='mb-1' required variant='outlined' label='Password' type='password'
              value={this.state.password} onChange={ev => this.handlePasswordChange(ev.target.value)} />
          </form>
          <div className='jc-center flex-column' >
            <Button className='mb-1' color='primary' variant='contained' onClick={this.handleLogin} >
              {this.state.isLoading ? <CircularProgress size={20} color="#ffffff" /> : "Login"}
            </Button>
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
  }

  handlePasswordChange = (value) => {
    this.setState({ password: value })
  }


  handleLogin = e => {
    e.preventDefault();
    this.setState({ isLoading: true })
    const { dispatch } = this.props;
    const { username, password } = this.state;
    console.log("before dispatch")
    dispatch(login(username, password));
    console.log("after dispatch")

  }

  responseReceived = () => {
    // console.log("response received props: ", this.props)
    // console.log("returns: ", this.props.user.hasOwnProperty('status'))
    return this.props.user.username
  }
}

const mapStateToProps = (state) => {
  console.log("login maps to props state: ", state)
  const { isAuthenticated, error, errorMessage, user } = state.auth;
  return {
    isAuthenticated,
    error,
    errorMessage,
    user
  }
}

export default connect(mapStateToProps)(LoginPage)

import { Button, Grid, TextField, Typography, Link } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { Component } from 'react'
import { connect } from "react-redux";
import { login, logout } from "../actions/authAction";
import LoadingIcon from '../components/LoadingIcon';
import { mapStateToProps } from '../helpers/helpers';

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
    console.log(this.responseReceived(), isLoading)
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
            <TextField className='mb-1' required variant='outlined' label='Username' type='text' name='username'
              value={this.state.username} onChange={this.handleChange} />
            <TextField className='mb-1' required variant='outlined' label='Password' type='password' name='password'
              value={this.state.password} onChange={this.handleChange} />
          </form>
          <div className='jc-center flex-column' >
            <Button disabled={!this.isLoginFormFilled()} className='mb-1' color='primary' variant='contained' onClick={this.handleLogin} >
              {this.state.isLoading ? <LoadingIcon size='sm' /> : "Login"}
            </Button>
            <Link variant='body1' href='/register' >
              Not registered yet? Register now!
            </Link>
          </div>
        </Grid>
      </div>
    )
  }

  isLoginFormFilled = () => {
    return this.state.username && this.state.password
  }

  handleChange = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value
    })
  }

  handleLogin = e => {
    if (!this.isLoginFormFilled()) return
    e.preventDefault();
    this.setState({ isLoading: true })
    const { dispatch } = this.props;
    const { username, password } = this.state;
    console.log("before dispatch")
    dispatch(login(username, password));
    console.log("after dispatch")
  }

  responseReceived = () => {
    return this.props.isAuthenticated || this.props.error
  }
}


export default connect(mapStateToProps)(LoginPage)

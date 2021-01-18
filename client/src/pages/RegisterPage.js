import { Button, Grid, MenuItem, TextField, Typography, Link } from '@material-ui/core'
import React, { Component } from 'react'
import { connect } from "react-redux";
import { register } from "../actions/authAction";
import LoadingIcon from '../components/LoadingIcon';
import { mapStateToProps } from '../helpers/helpers';

const genders = ['Male', 'Female']

class RegisterPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      email: '',
      username: '',
      password: '',
      gender: '',
      birthdate: '',
    }
  }

  render() {

    if (this.props.isAuthenticated && this.props.user) {
      this.props.history.push('/users/' + this.props.user.username)
    }

    return (
      <div className='page-container jc-center ai-center'>
        <Grid item className='px-1 py-1' xs={8} s={6} md={6} lg={4} xl={3}>
          <Typography variant='h3' >
            Register
        </Typography>
          <form className='flex-column my-1'>
            <TextField className='mb-1' required variant='outlined' label='Email' type='email' name='email'
              value={this.state.email} onChange={this.handleChange} />
            <TextField className='mb-1' required variant='outlined' label='Username' type='text' name='username'
              value={this.state.username} onChange={this.handleChange} />
            <TextField className='mb-1' required variant='outlined' label='Password' type='password' name='password'
              value={this.state.password} onChange={this.handleChange} />
            <TextField className='mb-1' select variant='outlined' label='Gender' type='text' name='gender'
              value={this.state.gender} onChange={this.handleChange} >
              {genders.map(option =>
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>)}
            </TextField>
            <TextField className='mb-1' InputLabelProps={{ shrink: true }} variant='outlined' label='Birthdate'
              type='date' name='birthdate' value={this.state.birthdate} onChange={this.handleChange} />
          </form>
          <div className='jc-center flex-column' >
            <Button disabled={!this.isFormFilled()} className='mb-1' color='primary' variant='contained' onClick={this.handleRegister} >
              {this.state.isLoading ? <LoadingIcon size='sm' /> : "Register"}
            </Button>
            <Link variant='body1' href='/login' >
              Already registered? Login here.
            </Link>
          </div>
        </Grid>
      </div>
    )
  }

  isFormFilled = () => {
    return this.state.email && this.state.username && this.state.password
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value
    })
  }

  handleRegister = (ev) => {
    if (!this.isFormFilled()) return
    this.setState({ isLoading: true })
    const { dispatch } = this.props;
    const user = { ...this.state, isLoading: undefined }
    dispatch(register(user));
  }

  responseReceived = () => {
    return this.props.isAuthenticated || this.props.error
  }
}

export default connect(mapStateToProps)(RegisterPage)




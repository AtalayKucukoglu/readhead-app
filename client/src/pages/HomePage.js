import React, { Component } from 'react'
import { Button, Typography } from '@material-ui/core'
import { connect } from 'react-redux'

class HomePage extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }
  render() {
    const { isAuthenticated, user } = this.props
    console.log(this.props)
    return (
      <div className='page-container jc-center ai-center flex-column'>
        <Typography variant='h1' >
          Welcome!
        </Typography>
        {
          isAuthenticated && user ?
            <Typography variant='h5'>
              Good to see you again, {user.username}
            </Typography>
            :
            <div className='my-1 flex-column'>
              <Button className='my-1' variant='contained' color='primary' onClick={this.handleLoginClick} >
                Login
              </Button>
              <Button className='my-1' variant='contained' color='primary' onClick={this.handleRegisterClick} >
                Register
              </Button>
            </div>
        }

      </div>
    )
  }

  handleLoginClick = (e) => {
    this.props.history.push('/login')
  }

  handleRegisterClick = (e) => {
    this.props.history.push('/register')
  }
}


const mapStateToProps = (state) => {
  console.log("home maps to props state: ", state)
  const { isAuthenticated, error, errorMessage, user } = state.auth;
  return {
    isAuthenticated,
    error,
    errorMessage,
    user
  }
}

export default connect(mapStateToProps)(HomePage)

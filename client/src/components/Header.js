import { ButtonBase, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../helpers/helpers'
import logo from '../images/logo.jpg'
import profilePicture from '../images/profile_picture.jpg'
import RoundedImage from './RoundedImage'


class Header extends Component {
  render() {
    const { isAuthenticated } = this.props
    const { username } = this.props.user
    return (
      <div className='header'>
        <div className='flex-row ai-center'>
          <img className='header-logo' src={logo} alt='ReadHead Logo' onClick={() => this.goTo('/')} />
          {/* if user is authenticated, show these: logout, search*/}
          {isAuthenticated ? this.renderRouteItem('Logout', '/login') : null}
          {isAuthenticated ? this.renderRouteItem('Search', '/search') : null}
          {/* if user is NOT authenticated, show these: login, register*/}
          {!isAuthenticated ? this.renderRouteItem('Login', '/login') : null}
          {!isAuthenticated ? this.renderRouteItem('Register', '/register') : null}
        </div>
        {/* if user is authenticated, show profile image as a link to profile*/}
        { isAuthenticated && username ?
          <RoundedImage src={profilePicture} alt='Profile' height='80%' onClick={() => this.goTo('/users/' + username)} />
          : null}
      </div>
    )
  }

  renderRouteItem(name, path) {
    return (
      <ButtonBase style={{ padding: 20 }} onClick={() => this.goTo(path)} >
        <Typography variant='h6' style={{ color: '#ffffff' }} >{name}</Typography>
      </ButtonBase>
    )
  }

  goTo = (path) => this.props.history.push(path)
}

export default connect(mapStateToProps)(Header)
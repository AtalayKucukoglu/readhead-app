import { Button, ButtonBase, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import logo from '../images/logo.jpg'
import profilePicture from '../images/profile_picture.jpg'
import RoundedImage from './RoundedImage'
import store from '../helpers/store'


export default class Header extends Component {
  render() {
    return (
      <div className='header'>
        <div className='flex-row ai-center'>
          <img className='header-logo' src={logo} alt='ReadHead Logo' onClick={() => this.goTo('/')}/>
          {this.renderRouteItem('Login', '/login')}
          {this.renderRouteItem('Register', '/register')}
          {this.renderRouteItem('Search', '/search')}
        </div>
        <RoundedImage src={profilePicture} alt='Profile' height='80%' onClick={() => {}} />
      </div>
    )
  }

  renderRouteItem(name, path) {
    return (
      <ButtonBase style={{padding: 20}} onClick={() => this.goTo(path)} >
        <Typography variant='h6' style={{color:'#ffffff'}} >{name}</Typography>
      </ButtonBase>
    )
  }

  goTo = (path) => this.props.history.push(path)
}

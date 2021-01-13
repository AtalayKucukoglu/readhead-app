import { Grid } from '@material-ui/core'
import React, { Component } from 'react'
import { Route, BrowserRouter as Router, Link, Switch } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import { connect } from 'react-redux'
import { getAuthorizationToken } from './helpers/helpers'
import { login, logout } from './actions/authAction'

class App extends Component {

  componentDidMount() {
    const token = getAuthorizationToken()
    console.log("app.js local storage token: ", token)
    if (!token) {
      this.props.dispatch(logout()); 
      return
    }
    console.log("try login via token app js")
    this.props.dispatch(login(null, null, token))
  }
 
  render() {
    console.log("app.js props", this.props)
    return (
      <Router>
        <div className='app-container'>
          <Route path='/' component={Header} />
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/register' component={RegisterPage} />
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/users/:username' component={ProfilePage} />
            <Route exact path='/search' component={SearchPage} />
          </Switch>
        </div>
      </Router>
    )
  }

}

export default connect(null)(App)
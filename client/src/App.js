import { Grid } from '@material-ui/core'
import React, { Component } from 'react'
import { Route, BrowserRouter as Router, Link, Switch } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import HomePage from './pages/HomePage'

export default class App extends Component {

  render() {
    return (
      <Router>
        <div className='app-container'>
          <Header />
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/register' component={RegisterPage} />
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/users/:username' component={ProfilePage} />
          </Switch>
        </div>
      </Router>
    )
  }

}
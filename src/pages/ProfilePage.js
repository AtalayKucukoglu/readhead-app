import { Typography } from '@material-ui/core'
import React, { Component } from 'react'
import RoundedImage from '../components/RoundedImage'
import pp from '../images/profile_picture.jpg'

export default class ProfilePage extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       user: {
         username: 'wadawada'
       }
    }
  }

  
  componentDidMount() {

  }

  
  render() {
    const { user } = this.state;
    return (
      <div className='page-container jc-center ai-center'>
        <RoundedImage height={100} src={pp} alt={user.username} />
        <Typography variant='h3'>
          {user.username}
        </Typography>
        <div>
          
        </div>
      </div>
    )
  }
}

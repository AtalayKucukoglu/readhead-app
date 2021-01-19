import { IconButton, Paper, TextField, Typography, Link, ButtonBase } from '@material-ui/core'
import { green, yellow, red, grey } from '@material-ui/core/colors'
import React, { PureComponent } from 'react'
import { searchBooksByTitle } from '../services/bookServices'
import { Favorite, Star, CheckCircle } from '@material-ui/icons';
import { mapStateToProps } from '../helpers/helpers.js'
import { connect } from 'react-redux';
import { getAllLists } from '../services/userServices';
import { addToList, deleteFromList, updateAllLists, UPDATE_LIST_OPERATIONS } from '../actions/userListsAction';

const { UPDATE_FAVORITES, UPDATE_HAVE_READ, UPDATE_TO_READ } = UPDATE_LIST_OPERATIONS

class ListItem extends PureComponent {
  render() {
    const { dispatch } = this.props; // redux props
    const { mode, item, username, isRead, isWanted, isFavorite, icons } = this.props // props from upper component
    return (
      <Paper key={item.book_id} elevation={3} className='flex-row mb-1 px-1 py-1 jc-sb ai-fs cursor-pointer' >
        {
          mode === 'book' ?
            <div key={item.book_id + '_info'} className='flex-column' style={{ width: '70%', }}>
              <Typography component={Link} color='inherit' onClick={() => this.props.history.push('/books/' + item.book_id)} variant='h5' >{item.title}</Typography>
              <Typography component={Link} color='inherit' onClick={() => this.props.history.push('/authors/' + item.author_id)} variant='subtitle1'>{item.name}</Typography>
              <Typography variant='subtitle2'>{item.publish_date} - {item.pages} pages</Typography>
            </div>
            :
            <div className='flex-column' style={{ width: '70%', }}>
              <Typography component={Link} color='inherit' onClick={() => this.props.history.push('/authors/' + item.author_id)} variant='h5' >{item.name}</Typography>
            </div>
        }
        {
          !icons ? null :
            <div key={item.book_id + '_icons'} className='flex-row' style={{ width: '30%', }}>
              <IconButton key={item.book_id + '_icons_read'} onClick={() => !isRead ? dispatch(addToList(username, item.book_id, UPDATE_HAVE_READ))
                : dispatch(deleteFromList(username, item.book_id, UPDATE_HAVE_READ))}>
                <div className='flex-column ai-center' >
                  <CheckCircle style={{ color: isRead ? green[500] : grey[500] }} />
                  <Typography variant='subtitle2'>Read</Typography>
                </div>
              </IconButton>
              <IconButton key={item.book_id + '_icons_wanted'} onClick={() => !isWanted ? dispatch(addToList(username, item.book_id, UPDATE_TO_READ))
                : dispatch(deleteFromList(username, item.book_id, UPDATE_TO_READ))}>
                <div className='flex-column ai-center'>
                  <Favorite style={{ color: isWanted ? red[500] : grey[500] }} />
                  <Typography variant='subtitle2'>Want To</Typography>
                </div>
              </IconButton>
              <IconButton key={item.book_id + '_icons_fav'} onClick={() => this.handleIconClick(UPDATE_FAVORITES, isFavorite)}>
                <div className='flex-column ai-center'>
                  <Star style={{ color: isFavorite ? yellow[500] : grey[500] }} />
                  <Typography variant='subtitle2'>Favorite</Typography>
                </div>
              </IconButton>
            </div>
        }
      </Paper>
    )
  }

  handleIconClick = (actionName, isInList) => {
    // if not in a list, add book to the list
    const id = this.props.mode === 'book' ? this.props.item.book_id : this.props.item.author_id 
    if (!isInList) {
      this.props.dispatch(addToList(this.props.username, id, actionName))
    }
    // else, delete book from list
    else {
      this.props.dispatch(deleteFromList(this.props.username, id, actionName))
    }
  }
}



export default connect(null)(ListItem)
import { combineReducers } from 'redux';

import authReducer from './authReducer';
import userListsReducer from './userListsReducer';

let rootReducer = combineReducers({
  auth: authReducer, lists: userListsReducer
});

export default rootReducer;
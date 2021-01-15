import { UPDATE_LIST_OPERATIONS } from "../actions/userListsAction";

const { UPDATE_FAVORITES, UPDATE_HAVE_READ, UPDATE_TO_READ, UPDATE_ALL_LISTS } = UPDATE_LIST_OPERATIONS

const initState = {
  favorites: [],
  haveRead: [],
  toRead: [],
}

const userListsReducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
      };
    case UPDATE_TO_READ:
      return {
        ...state,
        toRead: action.payload,
      };
    case UPDATE_HAVE_READ:
      return {
        ...state,
        haveRead: action.payload,
      };
    case UPDATE_ALL_LISTS:
      return {
        ...state,
        favorites: action.payload.favorites,
        haveRead: action.payload.haveRead,
        toRead: action.payload.toRead,
      };
    default:
      return state;
  }
}

export default userListsReducer;
import * as userServices from '../services/userServices';

const defaultErrorMessage = "An error occured. Please try again later."

// add to list operations
export const UPDATE_LIST_OPERATIONS = {
  UPDATE_FAVORITES: "UPDATE_FAVORITES",
  UPDATE_HAVE_READ: "UPDATE_HAVE_READ",
  UPDATE_TO_READ: "UPDATE_TO_READ",
  UPDATE_ALL_LISTS: "UPDATE_ALL_LISTS",
}

export const UPDATE_LIST_ERROR = "UPDATE_LIST_ERROR"

const { UPDATE_FAVORITES, UPDATE_HAVE_READ, UPDATE_TO_READ, UPDATE_ALL_LISTS } = UPDATE_LIST_OPERATIONS


const listnames = {
  "UPDATE_FAVORITES": "favorites",
  "UPDATE_TO_READ": "to-read",
  "UPDATE_HAVE_READ": "have-read",
}

const updateList = (newList, operation) => {
  return {
    type: operation,
    payload: newList
  };
};

export const updateAllLists = (newLists) => {
  return {
    type: UPDATE_ALL_LISTS,
    payload: newLists,
  }
}

const updateListError = (error) => {
  return {
    type: UPDATE_LIST_ERROR,
    error,
  }
}

export const test = () => dispatch => {
  return dispatch(updateList([], UPDATE_FAVORITES))
}


export const addToList = (username, book_id, actionName) => {
  return dispatch => {
    userServices.addBookToList(username, book_id, listnames[actionName])
      .then(async res => {
        // error handling
        if (!res) {
          dispatch(updateListError(defaultErrorMessage))
          return
        }
        if (!res.status) {
          return dispatch(updateListError(res.message || defaultErrorMessage))
        }
        // if succesfully added, get the updated list
        let updated = [] // updated list
        switch (actionName) {
          case UPDATE_FAVORITES: {
            updated = await userServices.getFavoritesList(username);
            break;
          }
          case UPDATE_TO_READ: {
            updated = await userServices.getToReadList(username);
            break;
          }
          case UPDATE_HAVE_READ: {
            updated = await userServices.getHaveReadList(username);
            break;
          }
          default:
            return dispatch(updateListError(defaultErrorMessage));
        }
        return dispatch(updateList(updated, actionName));
      })
      .catch(err => dispatch(updateListError(err)));
  }
}

export const deleteFromList = (username, book_id, actionName) => {
  return dispatch => {
    userServices.deleteBookFromList(username, book_id, listnames[actionName])
      .then(async res => {
        // error handling
        if (!res) {
          dispatch(updateListError(defaultErrorMessage))
          return
        }
        if (!res.status) {
          return dispatch(updateListError(res.message || defaultErrorMessage))
        }
        // if succesfully added, get the updated list
        let updated = [] // updated list
        switch (actionName) {
          case UPDATE_FAVORITES: {
            updated = await userServices.getFavoritesList(username);
            break;
          }
          case UPDATE_TO_READ: {
            updated = await userServices.getToReadList(username);
            break;
          }
          case UPDATE_HAVE_READ: {
            updated = await userServices.getHaveReadList(username);
            break;
          }
          default:
            return dispatch(updateListError(defaultErrorMessage));
        }
        return dispatch(updateList(updated, actionName));
      })
      .catch(err => dispatch(updateListError(err)));
  }
}

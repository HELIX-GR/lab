const _ = require('lodash');
const moment = require('moment');
const userService = require('../api/user');
// Actions
export const LOGIN = 'user/LOGIN';
export const LOGOUT = 'user/LOGOUT';
const REQUEST_LOGIN = 'user/REQUEST_LOGIN';
const REQUEST_LOGOUT = 'user/REQUEST_LOGOUT';
export const SHOW_LOGIN_MODAL = 'user/SHOW_LOGIN_MODAL';

const initialState = {
  username: null,
  loggedIn: null,
  profile: null,
  show_login: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_LOGIN:
      return state; // no-op
    case LOGIN:
      return {
        username: action.username,
        loggedIn: action.timestamp,
        profile: null,
        show_login: false,
      };
    case SHOW_LOGIN_MODAL:
      return { ...state,
        show_login:action.show_login*!(state.loggedIn),
      }
    case REQUEST_LOGOUT:
      return state; // no-op  
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

// Action Creators

const requestLogin = (username) => ({
  type: REQUEST_LOGIN,
  username,
});

const loggedIn = (username, token, timestamp) => ({
  type: LOGIN,
  username,
  token,
  timestamp,
});

const requestLogout = () => ({
  type: REQUEST_LOGOUT,
});

const loggedOut = (token, timestamp) => ({
  type: LOGOUT,
  token,
  timestamp,
});

export const modalLoginAction = (show_login) => ({
  type: SHOW_LOGIN_MODAL,
  show_login,
});




// Thunk actions
export const login = (username, password) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  dispatch(requestLogin(username));
  return userService.login(username, password, token).then(
    (r) => { 
      var t = moment().valueOf();
      dispatch(loggedIn(username, r.csrfToken, t));
    },
    (err) => {console.log(err);
      console.error('Failed login: ' + err.message);
      throw err;
    });
};

export const logout = () => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  dispatch(requestLogout());
  return userService.logout(token).then(
    (r) => {
      var t = moment().valueOf();
      dispatch(loggedOut(r.csrfToken, t));
    },
    (err) => {
      console.error('Failed logout');
      throw err;
    });
};
import _ from 'lodash';
import moment from '../moment-localized';

import userService from '../service/user';

// Actions

const LOGIN_REQUEST = 'user/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';

const LOGOUT_REQUEST = 'user/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'user/LOGOUT_SUCCESS';

const PROFILE_REQUEST = 'user/PROFILE_REQUEST';
const PROFILE_SUCCESS = 'user/PROFILE_SUCCESS';
const PROFILE_SAVE_REQUEST = 'user/PROFILE_SAVE_REQUEST';
const PROFILE_SAVE_SUCCESS = 'user/PROFILE_SAVE_SUCCESS';
const SERVERS_REQUEST = 'users/SERVERS_REQUEST';
const SERVERS_SUCCESS = 'users/SERVERS_SUCCESS';

const TOGGLE_LOGIN_DIALOG = 'user/TOGGLE_LOGIN_DIALOG';

// Initial state

const initialState = {
  lastLogin: null,
  profile: null,
  servers: [],
  showLoginForm: false,
  username: null,
};

// Reducer

export default (state = initialState, action) => {
  switch (action.type) {
    case SERVERS_REQUEST:
      return state;

    case LOGIN_SUCCESS:
      return {
        lastLogin: action.timestamp,
        profile: null,
        showLoginForm: false,
        username: action.username,
      };

    case LOGOUT_SUCCESS:
      return initialState;

    case PROFILE_SUCCESS:
      return {
        ...state,
        profile: {
          ...action.profile,
          _updatedAt: action.timestamp,
          _savedAt: action.timestamp, // in sync with server
        },
        username: action.profile.username || null,
        lastLogin: action.timestamp,
      };

    case PROFILE_SAVE_SUCCESS:
      return {
        ...state,
        username: state.profile.username || null,
        lastLogin: state.profile._updatedAt,
        profile: {
          ...state.profile,
          _savedAt: state.profile._updatedAt, // in sync again
        },
      };

    case SERVERS_SUCCESS:
      return {
        ...state,
        servers: action.servers,
      };

    case TOGGLE_LOGIN_DIALOG:
      return {
        ...state,
        showLoginForm: !state.showLoginForm,
      };

    default:
      return state;
  }
};

// Action Creators

const loginRequest = (username) => ({
  type: LOGIN_REQUEST,
  username,
});

const loginSuccess = (username, token, timestamp) => ({
  type: LOGIN_SUCCESS,
  username,
  token,
  timestamp,
});

const logoutRequest = () => ({
  type: LOGOUT_REQUEST,
});

const logoutSuccess = (token, timestamp) => ({
  type: LOGOUT_SUCCESS,
  token,
  timestamp,
});

const profileRequest = () => ({
  type: PROFILE_REQUEST,
});

const profileSuccess = (profile, timestamp) => ({
  type: PROFILE_SUCCESS,
  profile,
  timestamp,
});

const profileSaveRequest = () => ({
  type: PROFILE_SAVE_REQUEST,
});

const profileSaveSuccess = () => ({
  type: PROFILE_SAVE_SUCCESS,
});

const serversSuccess = (servers, timestamp) => ({
  type: SERVERS_SUCCESS,
  servers,
  timestamp,
});

export const toggleLoginDialog = () => ({
  type: TOGGLE_LOGIN_DIALOG,
});

// Thunk actions

export const login = (username, password) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();

  dispatch(loginRequest(username));

  return userService.login(username, password, token).then(
    (r) => {
      var t = moment().valueOf();
      dispatch(loginSuccess(username, r.csrfToken, t));
    });
};

export const logout = () => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();

  dispatch(logoutRequest());

  return userService.logout(token).then(
    (r) => {
      var t = moment().valueOf();
      dispatch(logoutSuccess(r.csrfToken, t));
    });
};

export const refreshProfile = () => (dispatch) => {
  dispatch(profileRequest());

  return userService.getProfile().then(
    (p) => {
      var t = moment().valueOf();
      dispatch(profileSuccess(p, t));
    });
};

export const saveProfile = () => (dispatch, getState) => {
  var { meta: { csrfToken: token }, user: { profile } } = getState();

  if (_.isEmpty(profile)) {
    return Promise.reject('The user profile is empty!');
  }

  dispatch(profileSaveRequest());

  return userService.saveProfile(profile, token).then(
    () => dispatch(profileSaveSuccess())
  );
};

export const getServers = () => (dispatch) => {
  return userService.getServers().then(
    (r) => {
      var t = moment().valueOf();
      dispatch(serversSuccess(r, t));
    });
};

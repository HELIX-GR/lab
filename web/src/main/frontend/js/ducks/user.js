import _ from 'lodash';
import moment from '../moment-localized';

import userService from '../service/user';
import { default as favoriteService } from '../service/favorite';

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

const ADD_FAVORITE_REQUEST = 'ui/news/ADD_FAVORITE_REQUEST';
const ADD_FAVORITE_RESPONSE = 'ui/news/ADD_FAVORITE_RESPONSE';
const REMOVE_FAVORITE_REQUEST = 'ui/news/REMOVE_FAVORITE_REQUEST';
const REMOVE_FAVORITE_RESPONSE = 'ui/news/REMOVE_FAVORITE_RESPONSE';

const ADD_TO_COLLECTION_REQUEST = 'ui/news/ADD_TO_COLLECTION_REQUEST';
const ADD_TO_COLLECTION_RESPONSE = 'ui/news/ADD_TO_COLLECTION_RESPONSE';
const REMOVE_FROM_COLLECTION_REQUEST = 'ui/news/REMOVE_FROM_COLLECTION_REQUEST';
const REMOVE_FROM_COLLECTION_RESPONSE = 'ui/news/REMOVE_FROM_COLLECTION_RESPONSE';

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
        username: action.profile.account.username || null,
        lastLogin: action.timestamp,
      };

    case PROFILE_SAVE_SUCCESS:
      return {
        ...state,
        username: state.profile.account.username || null,
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

    case ADD_FAVORITE_RESPONSE:
      return {
        ...state,
        profile: {
          ...state.profile,
          favorites: [...state.profile.favorites, { ...action.data }],
        },
      };

    case REMOVE_FAVORITE_RESPONSE:
      return {
        ...state,
        profile: {
          ...state.profile,
          favorites: state.profile.favorites.filter(f => f.catalog !== action.favorite.catalog || f.handle !== action.favorite.handle),
          collections: state.profile.collections.map(c1 => action.collections.find(c2 => c1.id === c2.id) || c1),
        }
      };

    case ADD_TO_COLLECTION_RESPONSE:
    case REMOVE_FROM_COLLECTION_RESPONSE:
      return {
        ...state,
        profile: {
          ...state.profile,
          collections: state.profile.collections.map(c => {
            if (c.id !== action.collection.id) {
              return c;
            }
            return { ...action.collection };
          }),
        },
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

const addFavoriteBegin = () => ({
  type: ADD_FAVORITE_REQUEST,
});

const addFavoriteComplete = (data) => ({
  type: ADD_FAVORITE_RESPONSE,
  data,
});

const removeFavoriteBegin = () => ({
  type: REMOVE_FAVORITE_REQUEST,
});

const removeFavoriteComplete = (favorite, collections) => ({
  type: REMOVE_FAVORITE_RESPONSE,
  favorite,
  collections,
});

const addFavoriteToCollectionBegin = () => ({
  type: ADD_TO_COLLECTION_REQUEST,
});

const addFavoriteToCollectionComplete = (collection) => ({
  type: ADD_TO_COLLECTION_RESPONSE,
  collection,
});

const removeFavoriteFromCollectionBegin = () => ({
  type: REMOVE_FROM_COLLECTION_REQUEST,
});

const removeFavoriteFromCollectionComplete = (collection) => ({
  type: REMOVE_FROM_COLLECTION_RESPONSE,
  collection,
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

export const addFavorite = (data) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();

  dispatch(addFavoriteBegin());
  return favoriteService.addFavorite(data.catalog, data.handle, data.title, data.description, data.url, token).then(
    (result) => {
      dispatch(addFavoriteComplete(result));

      return result;
    },
    (err) => {
      console.warn('Add favorite action failed: ' + err.message);
      throw err;
    });
};

export const removeFavorite = (favorite) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();

  dispatch(removeFavoriteBegin());
  return favoriteService.removeFavorite(favorite.catalog, favorite.handle, token).then(
    (collections) => {
      dispatch(removeFavoriteComplete(favorite, collections));
    },
    (err) => {
      console.warn('Remove favorite action failed: ' + err.message);
      throw err;
    });
};

export const addFavoriteToCollection = (collection, favorite) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();

  dispatch(addFavoriteToCollectionBegin());
  return favoriteService.addFavoriteToCollection(collection, favorite, token).then(
    (result) => {
      dispatch(addFavoriteToCollectionComplete(result));
    },
    (err) => {
      console.warn('Add favorite to collection action failed: ' + err.message);
      throw err;
    });
};

export const removeFavoriteFromCollection = (collection, favorite) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();

  dispatch(removeFavoriteFromCollectionBegin());
  return favoriteService.removeFavoriteFromCollection(collection, favorite, token).then(
    (result) => {
      dispatch(removeFavoriteFromCollectionComplete(result));
    },
    (err) => {
      console.warn('Add favorite to collection action failed: ' + err.message);
      throw err;
    });
};
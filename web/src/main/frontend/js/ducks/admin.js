import moment from '../moment-localized';

import adminService from '../service/admin';

// Actions

const SERVERS_SUCCESS = 'admin/SERVERS_SUCCESS';
const USER_ROLE_SUCCESS = 'admin/USER_ROLE_SUCCESS';
const USER_SERVERS_SUCCESS = 'admin/USER_SERVERS_SUCCESS';
const USERS_SUCCESS = 'admin/USERS_SUCCESS';
const WHITE_LIST_ROLE_SUCCESS = 'admin/WHITE_LIST_ROLE_SUCCESS';
const WHITELIST_SUCCESS = 'admin/WHITELIST_SUCCESS';

const SERVER_CREATE_SUCCESS = 'admin/SERVER_CREATE_SUCCESS';
const SERVER_UPDATE_SUCCESS = 'admin/SERVER_UPDATE_SUCCESS';

const USER_UPDATE_SUCCESS = 'admin/USER_UPDATE_SUCCESS';

// Reducer

const initialState = {
  isAdmin: false,
  servers: [],
  serversLastUpdate: null,
  users: [],
  usersLastUpdate: null,
  userServers: [],
  userServersLastUpdate: null,
  whitelist: [],
  whitelistLastUpdate: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SERVERS_SUCCESS:
      return {
        ...state,
        servers: action.servers,
        serversLastUpdate: action.timestamp,
      };

    case SERVER_CREATE_SUCCESS:
      return {
        ...state,
        servers: [...state.servers, action.server],
      };

    case SERVER_UPDATE_SUCCESS:
      return {
        ...state,
        servers: state.servers.map(s => s.id === action.server.id ? action.server : s),
      };

    case USERS_SUCCESS:
      return {
        ...state,
        users: action.users,
        usersLastUpdate: action.timestamp,
      };

    case USER_UPDATE_SUCCESS:
      return {
        ...state,
        users: state.users.map(u => u.id === action.user.id ? action.user : u),
      };

    case WHITELIST_SUCCESS:
      return {
        ...state,
        whitelist: action.whitelist,
        whitelistLastUpdate: action.timestamp,
      };

    case USER_SERVERS_SUCCESS:
      return {
        ...state,
        userServers: action.userServers,
        userServersLastUpdate: action.timestamp,
      };

    case USER_ROLE_SUCCESS:
      state.users.splice(action.index, 1, action.user);

      return {
        ...state,
        users: [
          ...state.users,
        ]
      };

    case WHITE_LIST_ROLE_SUCCESS:
      state.whitelist.splice(action.index, 1, action.user);

      return {
        ...state,
        whitelist: [
          ...state.whitelist,
        ]
      };

    default:
      return state;
  }
};

// Action Creators

const getServersSuccess = (servers, timestamp) => ({
  type: SERVERS_SUCCESS,
  servers,
  timestamp,
});

const getUsersSuccess = (users, timestamp) => ({
  type: USERS_SUCCESS,
  users,
  timestamp,
});

const getWhiteListSuccess = (whitelist, timestamp) => ({
  type: WHITELIST_SUCCESS,
  whitelist,
  timestamp,
});

const getUserServersSuccess = (userServers, timestamp) => ({
  type: USER_SERVERS_SUCCESS,
  userServers,
  timestamp,
});

const updateUserRoleSuccess = (user, index) => ({
  type: USER_ROLE_SUCCESS,
  user,
  index,
});

const updateWhiteListRoleSuccess = (user, index) => ({
  type: WHITE_LIST_ROLE_SUCCESS,
  user,
  index,
});

const addServerSuccess = (server) => ({
  type: SERVER_CREATE_SUCCESS,
  server,
});

const updateServerSuccess = (server) => ({
  type: SERVER_UPDATE_SUCCESS,
  server,
});

const updateUserSuccess = (user) => ({
  type: USER_UPDATE_SUCCESS,
  user,
});

// Thunk actions

export const getServers = () => (dispatch) => {
  return adminService.getServers().then(
    (r) => {
      var t = moment().valueOf();
      dispatch(getServersSuccess(r, t));
    });
};

export const addServer = (server) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();

  return adminService.addServer(server, token)
    .then((result) => {
      dispatch(addServerSuccess(result));

      return result;
    });
};

export const updateServer = (id, server) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();

  return adminService.updateServer(id, server, token)
    .then((result) => {
      dispatch(updateServerSuccess(result));

      return result;
    });
};

export const getUsers = () => (dispatch) => {
  return adminService.getUsers().then(
    (r) => {
      var t = moment().valueOf();
      dispatch(getUsersSuccess(r, t));
    });
};

export const updateUser = (id, user) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();

  return adminService.updateUser(id, user, token)
    .then((result) => {
      dispatch(updateUserSuccess(result));

      return result;
    });
};

export const getUserServers = () => (dispatch) => {
  return adminService.getUserServers().then(
    (servers) => {
      var t = moment().valueOf();
      dispatch(getUserServersSuccess(servers, t));
    });
};

export const removeUserServer = (id) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  return adminService.removeUserServer(id, token)
    .then(() => {
      return dispatch(getUserServers());
    });
};

export const grantUserRole = (id, role) => (dispatch, getState) => {
  var { admin: { users }, meta: { csrfToken: token } } = getState();

  var index = users.findIndex((u) => (u.id === id));

  return adminService.grantUserRole(id, role, token).then(
    (r) => {
      dispatch(updateUserRoleSuccess(r, index));
    });
};

export const revokeUserRole = (id, role) => (dispatch, getState) => {
  var { admin: { users }, meta: { csrfToken: token } } = getState();

  var index = users.findIndex((e) => (e.id === id));

  return adminService.revokeUserRole(id, role, token).then(
    (r) => {
      dispatch(updateUserRoleSuccess(r, index));
    });
};

export const getWhiteList = () => (dispatch) => {
  return adminService.getWhiteList().then(
    (r) => {
      var t = moment().valueOf();
      dispatch(getWhiteListSuccess(r, t));
    });
};

export const grantWhiteListRole = (id, role) => (dispatch, getState) => {
  var { admin: { whitelist }, meta: { csrfToken: token } } = getState();

  var index = whitelist.findIndex((e) => (e.id === id));

  return adminService.grantWhiteListRole(id, role, token).then(
    (r) => {
      dispatch(updateWhiteListRoleSuccess(r, index));
    });
};

export const revokeWhiteList = (id, role) => (dispatch, getState) => {
  var { admin: { whitelist }, meta: { csrfToken: token } } = getState();

  var index = whitelist.findIndex((e) => (e.id === id));

  return adminService.revokeWhiteListRole(id, role, token).then(
    (r) => {
      dispatch(updateWhiteListRoleSuccess(r, index));
    });
};

export const addWhiteListUser = (userInfo) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  return adminService.addWhiteListUser(userInfo, token).then(
    () => {
      dispatch(getWhiteList());
    });
};

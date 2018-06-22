import moment from 'moment';
import adminService from '../service/admin';

const GOT_SERVERS = 'admin/GOT_SERVERS';
const GOT_USERS = 'admin/GOT_USERS';
const GOT_USERS_TO_SERVERS = 'admin/GOT_USERS_TO_SERVERS';
const GOT_EDITED_USERS = 'admin/GOT_EDITED_USERS';


const initialState = {
  isadmin: false,
  servers: [],
  users: [],
  u2s: [],
};


export default (state = initialState, action) => {
  switch (action.type) {
    case GOT_SERVERS:
      return {
        ...state,
        servers: action.servers,
        servers_update: action.timestamp,
      };
    case GOT_USERS:
      return {
        ...state,
        users: action.users,
        users_update: action.timestamp,
      };
    case GOT_EDITED_USERS:
      state.users.splice(action.ind, 1, action.user);
      return {
        ...state,
        users: [
          ...state.users,
        ]
      };
    case GOT_USERS_TO_SERVERS:
      return {
        ...state,
        u2s: action.u2s,
        u2s_update: action.timestamp,
      };

    default:
      return state;
  }
};


// Action Creators

const gotServers = (servers, timestamp) => ({
  type: GOT_SERVERS,
  servers,
  timestamp,
});

const gotUsers = (users, timestamp) => ({
  type: GOT_USERS,
  users,
  timestamp,
});

const gotUsersToServers = (u2s, timestamp) => ({
  type: GOT_USERS_TO_SERVERS,
  u2s,
  timestamp,
});

const gotEditedUser = (user, ind) => ({
  type: GOT_EDITED_USERS,
  user,
  ind,
});


// Thunk actions
export const requestServers = () => (dispatch) => {
  return adminService.getServers().then(
    (r) => {
      var t = moment().valueOf();
      dispatch(gotServers(r, t));
    },
    (err) => {
      console.error('Failed to get servers: ' + err.message);
      throw err;
    });
};

export const addNewServer = (server_data) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  return adminService.addServer(server_data, token).then(
    (r) => {
      dispatch(requestServers());
    },
    (err) => {
      console.error('Failed to add server: ' + err.message);
      throw err;
    });
};

export const requestUsers = () => (dispatch) => {
  return adminService.getUsers().then(
    (r) => {
      var t = moment().valueOf();
      dispatch(gotUsers(r, t));
    },
    (err) => {
      console.error('Failed to get Users: ' + err.message);
      throw err;
    });
};

export const requestUsersToServers = () => (dispatch) => {
  return adminService.getUsersToServers().then(
    (r) => {
      var t = moment().valueOf();
      dispatch(gotUsersToServers(r, t));
    },
    (err) => {
      console.error('Failed to get Users: ' + err.message);
      throw err;
    });
};

export const grand_role = (id, role) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  var { admin } = getState();
  var ind = admin.users.findIndex((e) => (e.id === id));
  return adminService.grandRole(id, role, token).then(
    (r) => {
      dispatch(gotEditedUser(r, ind));
    },
    (err) => {
      console.error('Failed to grand role: ' + err.message);
      throw err;
    });
};

export const revoke_role = (id, role) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  var { admin } = getState();
  var ind = admin.users.findIndex((e) => (e.id === id));
  return adminService.revokeRole(id, role, token).then(
    (r) => {
      dispatch(gotEditedUser(r, ind));
    },
    (err) => {
      console.error('Failed to revoke role: ' + err.message);
      throw err;
    });
};
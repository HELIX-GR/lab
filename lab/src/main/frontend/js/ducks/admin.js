import moment from 'moment';
import adminService from '../service/admin';
import { toast, } from 'react-toastify';

const GOT_SERVERS = 'admin/GOT_SERVERS';
const GOT_USERS = 'admin/GOT_USERS';
const GOT_USERS_TO_SERVERS = 'admin/GOT_USERS_TO_SERVERS';
const GOT_EDITED_USERS = 'admin/GOT_EDITED_USERS';
const GOT_WHITELIST = 'admin/GOT_WHITELIST';
const GOT_EDITED_WHITELIST = 'admin/GOT_EDITED_WHITELIST';

const initialState = {
  isadmin: false,
  servers: [],
  users: [],
  whitelist: [],
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
    case GOT_WHITELIST:
      return {
        ...state,
        whitelist: action.whitelist,
        whitelist_update: action.timestamp,
      };
    case GOT_EDITED_USERS:
      state.users.splice(action.ind, 1, action.user);
      return {
        ...state,
        users: [
          ...state.users,
        ]
      };
    case GOT_EDITED_WHITELIST:
      state.whitelist.splice(action.ind, 1, action.user);
      return {
        ...state,
        whitelist: [
          ...state.whitelist,
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

const gotWhiteList = (whitelist, timestamp) => ({
  type: GOT_WHITELIST,
  whitelist,
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

const gotEditedWhiteList = (user, ind) => ({
  type: GOT_EDITED_WHITELIST,
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
      toast.success("Server registered");
      dispatch(requestServers());
    },
    (err) => {
      toast.error('Failed to add server: ' + err.message);
      throw err;
    });
};

export const editServer = (id, server_data) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  return adminService.editServer(id, server_data, token).then(
    (r) => {
      toast.success("Server edited");
      dispatch(requestServers());
    },
    (err) => {
      toast.error('Failed to edit server: ' + err.message);
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


export const requestWhiteList = () => (dispatch) => {
  return adminService.getWhiteList().then(
    (r) => {
      var t = moment().valueOf();
      dispatch(gotWhiteList(r, t));
    },
    (err) => {
      console.error('Failed to get White List: ' + err.message);
      throw err;
    });
};

export const grand_WL_role = (id, role) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  var { admin } = getState();
  var ind = admin.whitelist.findIndex((e) => (e.id === id));
  return adminService.grandWLRole(id, role, token).then(
    (r) => {
      dispatch(gotEditedWhiteList(r, ind));
    },
    (err) => {
      console.error('Failed to grand role: ' + err.message);
      throw err;
    });
};

export const revoke_WL_role = (id, role) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  var { admin } = getState();
  var ind = admin.whitelist.findIndex((e) => (e.id === id));
  return adminService.revokeWLRole(id, role, token).then(
    (r) => {
      dispatch(gotEditedWhiteList(r, ind));
    },
    (err) => {
      toast.error('Failed to revoke role: ' + err.message);
      throw err;
    });
};


export const addWhiteList = (userInfo) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  return adminService.addWhiteListUser(userInfo, token).then(
    (r) => {
      dispatch(requestWhiteList());
    },
    (err) => {
      toast.error('Failed to add user to White List: ' + err.message);
      throw err;
    });
};
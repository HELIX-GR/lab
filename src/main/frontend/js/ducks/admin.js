const _ = require('lodash');
const moment = require('moment');
const adminService = require('../service/admin');

const GOT_SERVERS = 'admin/GOT_SERVERS';
const IS_ADMIN = 'admin/IS_ADMIN';
const GOT_USERS = 'admin/GOT_USERS';


const initialState = {
  isadmin: true,
  servers:[],
  users:[],
};


export default (state = initialState, action) => {
  switch (action.type) {
    case IS_ADMIN:
    return {
      ...state,
      isadmin: action.admin_status,
    };
    case GOT_SERVERS:
    return {
      ...state,
      servers:action.servers,
      servers_update:action.timestamp,
    };
    case GOT_USERS:
    return {
      ...state,
      users:action.users,
      users_update:action.timestamp,
    };
    
    default:
      return state;
  }
};


// Action Creators

const isAdmin = (admin_status) => ({
  type: IS_ADMIN,
  admin_status,
});

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
      var t = moment().valueOf();
      dispatch(gotServers(r, t));
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




export const isAdminThunk = () => (dispatch, getState) => {
  var { users: { profile: roles } } = getState();
  console.log(roles);
  for(var i=0;i<roles.length;i++)
  {
      if(p.roles[i]==="ROLE_ADMIN"){dispatch(isAdmin(true));}
  }
  dispatch(isAdmin(false));
  return null;
};


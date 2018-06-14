import moment from 'moment';
import adminService from '../service/admin';

const GOT_SERVERS = 'admin/GOT_SERVERS';
const GOT_USERS = 'admin/GOT_USERS';


const initialState = {
  isadmin: false,
  servers: [],
  users: [],
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

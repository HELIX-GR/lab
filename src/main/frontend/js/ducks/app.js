const appService = require('../service/app');

export const START_NOW = 'app/START_NOW';
const GOT_SERVER = 'app/GOT_SERVER';
const GOT_STATUS = 'app/GOT_STATUS';

var initialState = {
  success: null,
  error: null,
  status: null,
  statistics: null,
  target: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case START_NOW:
      return initialState;
    case GOT_SERVER:
      return {
        ...state,
        target: action.target,
      };
    case GOT_STATUS:
      return {
        ...state,
        status: action.status,
      };

    default:
      return state;
  }
};

const got_server = (r, t) => ({
  type: GOT_SERVER,
  target: r,

});
const got_status = (r, t) => ({
  type: GOT_STATUS,
  status: r,

});

// Thunk actions
export const startNowAction = (username, password) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  return appService.startJupyter().then(
    (r) => {
      console.log(r);
      dispatch(got_server(r));
    },
    (err) => {
      console.log(err);
      console.error('Failed login: ' + err.message);
      throw err;
    });
};

export const getUserInfoAction = () => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  return appService.getUserServerInfo().then(
    (r) => {
      console.log(r);
      dispatch(got_status(r));
    },
    (err) => {
      console.error('Failed login: ' + err.message);
      throw err;
    });
};

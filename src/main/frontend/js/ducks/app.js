const appService = require('../service/app');

export const START_NOW = 'app/START_NOW';
const GOT_SERVER = 'app/GOT_SERVER';
const GOT_STATUS = 'app/GOT_STATUS';
const SET_SELECTED_HUB = 'app/SET_SELECTED_HUB';
const ASK_SERVER = 'app/ASK_SERVER';

var initialState = {
  success: null,
  error: null,
  status: null,
  statistics: null,
  target: null,
  selected_hub: null,
  server_stage: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case START_NOW:
      return initialState;
    case ASK_SERVER:
      return {
        ...state,
        server_stage: action.stage,
      };
    case GOT_SERVER:
      return {
        ...state,
        target: action.target,
        server_stage: 3,
      };
    case GOT_STATUS:
      return {
        ...state,
        status: action.status,
      };
    case SET_SELECTED_HUB:
      return {
        ...state,
        selected_hub: action.selected_hub,
        server_stage: 1,
      };

    default:
      return state;
  }
};
export const asked_server_to_start = (stage) => ({
  type: ASK_SERVER,
  stage,
});
const got_server = (r, t) => ({
  type: GOT_SERVER,
  target: r,

});
const got_status = (r, t) => ({
  type: GOT_STATUS,
  status: r,

});

export const setSelectedHub = (selected_hub) => ({
  type: SET_SELECTED_HUB,
  selected_hub,
});

// Thunk actions
export const startNowAction = (hub_id) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  dispatch(asked_server_to_start(2));
  return appService.startJupyter(hub_id).then(
    (r) => {
      console.log(r);
      dispatch(got_server(r));
    },
    (err) => {
      console.log(err);
      console.error('Failed login: ' + err.message);
      dispatch(asked_server_to_start(0));
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



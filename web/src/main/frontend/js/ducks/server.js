import appService from '../service/server';

const EnumServerStatus = {
  NONE: 0,
  CONFIGURATION: 1,
  STARTING: 2,
  RUNNING: 3,
};

// Actions

const SERVER_STATUS_SUCCESS = 'server/SERVER_STATUS_SUCCESS';
const SET_SELECTED_HUB = 'server/SET_SELECTED_HUB';
const SET_SERVER_ENDPOINT = 'server/SET_SERVER_ENDPOINT';
const SET_SERVER_SELECTION_STAGE = 'server/SET_SERVER_SELECTION_STAGE';

// Reducer

var initialState = {
  endpoint: null,
  error: null,
  selectedHub: null,
  selectedKernel: null,
  serverStage: EnumServerStatus.NONE,
  statistics: null,
  status: null,
  success: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVER_SELECTION_STAGE:
      return {
        ...state,
        serverStage: action.stage,
      };

    case SET_SERVER_ENDPOINT:
      return {
        ...state,
        endpoint: action.endpoint,
        serverStage: EnumServerStatus.RUNNING,
      };

    case SERVER_STATUS_SUCCESS:
      return {
        ...state,
        endpoint: action.endpoint,
        serverStage: action.serverStage,
        selectedHub: action.server,
        selectedKernel: action.kernel,
      };

    case SET_SELECTED_HUB:
      return {
        ...state,
        selectedHub: action.selectedHub,
        selectedKernel: action.selectedKernel,
        serverStage: EnumServerStatus.CONFIGURATION,
      };

    default:
      return state;
  }
};

// Actions

export const setSelectedHub = (selectedHub, selectedKernel) => ({
  type: SET_SELECTED_HUB,
  selectedHub,
  selectedKernel,
});

const getUserServerSuccess = (server, kernel, endpoint, serverStage) => ({
  type: SERVER_STATUS_SUCCESS,
  endpoint,
  server,
  kernel,
  serverStage,
});

const setStartupStage = (stage) => ({
  type: SET_SERVER_SELECTION_STAGE,
  stage,
});

const setEndpoint = (endpoint) => ({
  type: SET_SERVER_ENDPOINT,
  endpoint: endpoint,
});

// Thunk actions

export const getUserServer = () => (dispatch, getState) => {
  return appService.getUserServer().then(
    (r) => {
      if (r) {
        dispatch(getUserServerSuccess(r.server, r.kernel, r.endpoint, EnumServerStatus.RUNNING));
      }
      else {
        dispatch(getUserServerSuccess(null, null, null, EnumServerStatus.NONE));
      }
    });
};

export const startNotebookServer = (serverId, kernel) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();

  dispatch(setStartupStage(EnumServerStatus.STARTING));

  return appService.startNotebookServer(serverId, kernel, token).then(
    (endpoint) => {
      dispatch(setEndpoint(endpoint));
    },
    (err) => {
      dispatch(setStartupStage(EnumServerStatus.NONE));
      throw err;
    });
};

export const stopNotebookServer = (serverId) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();

  return appService.stopNotebookServer(serverId, token)
    .then(
      () => {
        dispatch(setStartupStage(EnumServerStatus.NONE));
      },
      (err) => {
        dispatch(setStartupStage(EnumServerStatus.RUNNING));
        throw err;
      })
    .finally(dispatch(setEndpoint(null)));
};

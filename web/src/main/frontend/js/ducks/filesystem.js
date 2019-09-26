import moment from '../moment-localized';

import filesystemService from '../service/filesystem';

// Actions

const FILESYSTEM_REQUEST = 'config/FILESYSTEM_REQUEST';
const FILESYSTEM_SUCCESS = 'config/FILESYSTEM_SUCCESS';
const SET_NEW_FOLDER = 'config/SET_NEW_FOLDER';
const SET_TABLE_PATH = 'config/SET_TABLE_PATH';

// Reducer

const initialState = {
  // File system data
  data: {
    count: 0,
    files: [],
    folders: [],
    name: "",
    path: "/",
  },
  // UI state
  newFolder: false,
  selectedFile: "",
  tablePath: "/",
  updatedAt: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FILESYSTEM_SUCCESS:
      return {
        ...state,
        data: {
          ...action.filesystem,
          name: "",
          path: "/",
        },
        updatedAt: action.timestamp,
      };

    case SET_TABLE_PATH:
      return {
        ...state,
        tablePath: action.tablePath,
        selectedFile: action.selectedFile,
      };

    case SET_NEW_FOLDER:
      return {
        ...state,
        newFolder: action.newFolder,
      };

    default:
      return state;
  }
};

// Action Creators

const filesystemRequest = () => ({
  type: FILESYSTEM_REQUEST,
});

const filesystemSuccess = (filesystem, timestamp) => ({
  type: FILESYSTEM_SUCCESS,
  filesystem,
  timestamp,
});

export const setTablePath = (tablePath, selectedFile) => ({
  type: SET_TABLE_PATH,
  tablePath,
  selectedFile,
});

export const setNewFolder = (newFolder) => ({
  type: SET_NEW_FOLDER,
  newFolder,
});

// Thunk actions

export const getFilesystem = () => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(filesystemRequest());

  return filesystemService.fetch(token)
    .then((fs) => {
      var t = moment().valueOf();
      dispatch(filesystemSuccess(fs, t));
    });
};

export const createFolder = (path) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.createFolder(path, token)
    .then((fs) => {
      var t = moment().valueOf();
      dispatch(filesystemSuccess(fs, t));
    });
};

export const deletePath = (path) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.deletePath(path, token)
    .then((fs) => {
      var t = moment().valueOf();
      dispatch(filesystemSuccess(fs, t));
    });
};

export const uploadFile = (data, file) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.upload(data, file, token)
    .then((fs) => {
      var t = moment().valueOf();
      dispatch(filesystemSuccess(fs, t));
    });
};

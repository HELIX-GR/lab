import moment from '../moment-localized';

import filesystemService from '../service/filesystem';

// Actions

const FILESYSTEM_REQUEST = 'file-system/FILESYSTEM_REQUEST';
const FILESYSTEM_SUCCESS = 'file-system/FILESYSTEM_SUCCESS';
const SET_NEW_FOLDER = 'file-system/SET_NEW_FOLDER';
const SET_PATH = 'file-system/SET_PATH';
const DELETE_PATH_SUCCESS = 'file-system/DELETE_PATH_SUCCESS';

// Reducer

const initialState = {
  // File system data
  data: {
    count: 0,
    files: [],
    folders: [],
    name: '',
    path: '',
  },
  // UI state
  newFolder: false,
  path: '',
  selectedFile: '',
  selectedFolder: null,
  updatedAt: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FILESYSTEM_SUCCESS:
      return {
        ...state,
        data: {
          ...action.filesystem,
        },
        updatedAt: action.timestamp,
      };

    case SET_PATH:
      return {
        ...state,
        path: action.folder.path,
        selectedFile: action.file,
        selectedFolder: action.folder ? action.folder.folders.find(f => f.name === action.file) || null : null,
      };

    case SET_NEW_FOLDER:
      return {
        ...state,
        newFolder: action.newFolder,
      };

    case DELETE_PATH_SUCCESS:
      return {
        ...state,
        selectedFile: '',
      };

    default:
      return state;
  }
};

// Action Creators

const getFileSystemRequest = () => ({
  type: FILESYSTEM_REQUEST,
});

const getFileSystemSuccess = (filesystem, timestamp) => ({
  type: FILESYSTEM_SUCCESS,
  filesystem,
  timestamp,
});

export const setPath = (folder, file) => ({
  type: SET_PATH,
  folder,
  file,
});

export const setNewFolder = (newFolder) => ({
  type: SET_NEW_FOLDER,
  newFolder,
});

const deletePathSuccess = () => ({
  type: DELETE_PATH_SUCCESS,
});

// Thunk actions

export const getFileSystem = () => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(getFileSystemRequest());

  return filesystemService.fetch(token)
    .then((fs) => {
      var t = moment().valueOf();
      dispatch(getFileSystemSuccess(fs, t));
    });
};

export const createFolder = (path) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.createFolder(path, token)
    .then((fs) => {
      var t = moment().valueOf();
      dispatch(getFileSystemSuccess(fs, t));
    });
};

export const deletePath = (path) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.deletePath(path, token)
    .then((fs) => {
      var t = moment().valueOf();
      dispatch(deletePathSuccess());
      dispatch(getFileSystemSuccess(fs, t));
    });
};

export const uploadFile = (data, file) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.upload(data, file, token)
    .then((fs) => {
      var t = moment().valueOf();
      dispatch(getFileSystemSuccess(fs, t));
    });
};

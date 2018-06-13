// config.js
import configurationService from '../service/configuration';
import filesystemService from '../service/filesystem';

// Actions
const REQUEST_CONFIGURATION = 'config/REQUEST_CONFIGURATION';
const LOAD_CONFIGURATION = 'config/LOAD_CONFIGURATION';

const REQUEST_FILESYSTEM = 'config/REQUEST_FILESYSTEM';
const RECEIVE_FILESYSTEM = 'config/RECEIVE_FILESYSTEM';
const SET_TABEL_PATH = 'config/SET_TABEL_PATH';
const SET_NEW_FOLDER = 'config/SET_NEW_FOLDER';

const initialState = {
  filesystem: {
    count: 0,
    files: [],
    folders: [],
    name: "",
    path: "/",
  },
  table_path: "/",
  selected_file: "",
  new_folder: false,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_CONFIGURATION:
      return state;
    case LOAD_CONFIGURATION:
      return {
        ...state,
        ...action.configuration,
      };

    case SET_TABEL_PATH:
      return {
        ...state,
        table_path: action.table_path,
        selected_file: action.selected_file,
      };

    case SET_NEW_FOLDER:
      return {
        ...state,
        new_folder: action.new_folder,
      };
      
    case LOAD_CONFIGURATION:
      return {
        ...state,
        ...action.configuration,
      };

    case REQUEST_FILESYSTEM:
      return state;

    case RECEIVE_FILESYSTEM:
      return {
        ...state,
        filesystem: action.filesystem,
      };

    default:
      return state;

  }
};

// Action Creators
export const requestConfiguration = () => ({
  type: REQUEST_CONFIGURATION,
});

export const receiveConfiguration = (configuration) => ({
  type: LOAD_CONFIGURATION,
  configuration,
});

export const requestFilesystem = () => ({
  type: REQUEST_FILESYSTEM,
});

export const receiveFilesystem = (filesystem) => ({
  type: RECEIVE_FILESYSTEM,
  filesystem,
});

export const setTablePath = (table_path, selected_file) => ({
  type: SET_TABEL_PATH,
  table_path,
  selected_file,
});

export const setNewFolder = (new_folder) => ({
  type: SET_NEW_FOLDER,
  new_folder,
});

// Thunk actions
export const getConfiguration = (locale) => (dispatch, getState) => {

  dispatch(requestConfiguration());
  return configurationService.getConfiguration(locale)
    .then((configuration) => {
      dispatch(receiveConfiguration(configuration));
    })
    .catch((err) => {
      console.error('Error receiving configuration', err);
    });
};

export const getFilesystem = () => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(requestFilesystem());
  return filesystemService.fetch(token)
    .then((fs) => {
      dispatch(receiveFilesystem(fs));
    })
    .catch((err) => {
      console.error('Error receiving filesystem', err);
    });
};

export const createFolder = (path) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.createFolder(path, token)
    .then((fs) => {
      dispatch(receiveFilesystem(fs));
    });
};

export const uploadFile = (data, file) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();
  console.log("uploading file");

  console.log(data, file);
  return filesystemService.upload(data, file, token)
    .then((fs) => {
      dispatch(receiveFilesystem(fs));
    });
};

export const deletePath = (path) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.deletePath(path, token)
    .then((fs) => {
      dispatch(receiveFilesystem(fs));
    });
};
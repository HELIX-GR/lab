import moment from 'moment';
import { toast, } from 'react-toastify';

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
const RECEIVE_PUBLISH = 'config/RECEIVE_PUBLISH';

const initialState = {
  filesystem: {
    count: 0,
    files: [],
    folders: [],
    name: "",
    path: "/",
  },
  publish: [],
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

    case REQUEST_FILESYSTEM:
      return state;

    case RECEIVE_FILESYSTEM:
      return {
        ...state,
        filesystem: {
          ...action.filesystem,
          name: "",
          path: "/"
        },
        last_updated: action.timestamp,
      };
    case RECEIVE_PUBLISH:
      return {
        ...state,
        publish: {
          ...action.publish,
        }
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

export const receiveFilesystem = (filesystem, timestamp) => ({
  type: RECEIVE_FILESYSTEM,
  filesystem,
  timestamp,
});

export const receivePublish = (publish, timestamp) => ({
  type: RECEIVE_PUBLISH,
  publish,
  timestamp,
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
export const getConfiguration = (locale) => (dispatch) => {

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
      var t = moment().valueOf();
      dispatch(receiveFilesystem(fs, t));
    })
    .catch((err) => {
      console.error('Error receiving filesystem', err);
    });
};

export const createFolder = (path) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.createFolder(path, token)
    .then((fs) => {
      var t = moment().valueOf();
      dispatch(receiveFilesystem(fs, t));
    });
};

export const uploadFile = (data, file) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();
  return filesystemService.upload(data, file, token)
    .then((fs) => {
      var t = moment().valueOf();
      dispatch(receiveFilesystem(fs, t));
    });
};

export const publishFile = (data) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.publish(data, token)
    .then((fs) => {
      var t = moment().valueOf();
      if (fs.result) {
        dispatch(receivePublish(fs.result, t))
          .then(toast.success(<span>File Published! <a href={"/notebook/" + fs.result.package_id}> See it!</a></span>, {
            autoClose: 50000,
            closeOnClick: false,
            pauseOnHover: true
          }));
      }
    })
    .catch((err) => {
      toast.error('File Not Published!')
    });
};

export const getNotebookToFilesystem = (id) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.getNotebook(id, token)
    .then((fs) => {
      //TODO handle
    })
    .catch((err) => {
      console.error('Error geting the file', err);
    });
};



export const deletePath = (path) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return filesystemService.deletePath(path, token)
    .then((fs) => {
      var t = moment().valueOf();
      dispatch(receiveFilesystem(fs, t));
    });
};
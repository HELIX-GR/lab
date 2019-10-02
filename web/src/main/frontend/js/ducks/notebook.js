import { toast, } from 'react-toastify';
import moment from '../moment-localized';

import notebookService from '../service/notebook';

// Actions

const PUBLISH_NOTEBOOK_SUCCESS = 'notebook/PUBLISH_NOTEBOOK_SUCCESS';

// Reducer

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {

    case PUBLISH_NOTEBOOK_SUCCESS:
      return {
        ...state,
        ...action.publish,
      };

    default:
      return state;
  }
};

// Action Creators

const publishNotebookSuccess = (publish, timestamp) => ({
  type: PUBLISH_NOTEBOOK_SUCCESS,
  publish,
  timestamp,
});

// Thunk actions

export const publishNotebook = (data) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return notebookService.publishNotebook(data, token)
    .then((fs) => {
      var t = moment().valueOf();
      if (fs) {
        dispatch(publishNotebookSuccess(fs, t))
          .then(toast.success(<span>File Published! <a href={"/notebook/" + fs.package_id}> See it!</a></span>, {
            autoClose: 50000,
            closeOnClick: false,
            pauseOnHover: true
          }));
      }
    });
};

export const getNotebookToFilesystem = (id) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return notebookService.getNotebook(id, token)
    .then((fs) => {
      //TODO handle
    });
};

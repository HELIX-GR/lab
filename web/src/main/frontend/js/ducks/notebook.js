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
        ...action.resource,
      };

    default:
      return state;
  }
};

// Action Creators

const publishNotebookSuccess = (resource) => ({
  type: PUBLISH_NOTEBOOK_SUCCESS,
  resource,
});

// Thunk actions

export const publishNotebook = (data) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return notebookService.publishNotebook(data, token)
    .then((resource) => {
      if (resource) {
        dispatch(publishNotebookSuccess(resource));
      }

      return resource || null;
    });
};

export const getNotebookToFilesystem = (id) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  return notebookService.getNotebook(id, token)
    .then((fs) => {
      //TODO handle
    });
};

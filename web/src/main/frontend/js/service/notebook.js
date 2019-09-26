import actions from './api/fetch-actions';

export default {

  publishNotebook: (data, token) => {
    return actions.post('/action/file-system/notebook', token, data);
  },

  getNotebook: (id, token) => {
    return actions.get(`/action/file-system/notebook/${id}`, token);
  },

};

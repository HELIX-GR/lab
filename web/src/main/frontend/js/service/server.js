import actions from './api/fetch-actions';

export default {

  getUserServer: () => {
    return actions.get('/action/user/server');
  },

  startNotebookServer: (serverId, kernel, token) => {
    return actions.post(`/action/server/start/${serverId}/${kernel}`, token);
  },

  stopNotebookServer: (serverId, token) => {
    return actions.delete(`/action/server/stop/${serverId}`, token);
  },

};

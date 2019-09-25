const actions = require('./api/fetch-actions');

var api = {

  startJupyter: (serverId, token) => {
    return actions.post(`/action/server/start/${serverId}`, token);
  },

  stopJupyter: (serverId, token) => {
    return actions.delete(`/action/server/stop/${serverId}`, token);
  },

  getUserServerInfo: () => {
    return actions.get('/action/user/server');
  },

};

module.exports = api;
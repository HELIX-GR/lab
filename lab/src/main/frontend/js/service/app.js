const actions = require('./api/fetch-actions');

var api = {

  startJupyter: (server_id) => {
    return actions.get('/action/start/'+server_id);
  },

  stopJupyter: (server_id, token ) => {
    return actions.post('/action/stop/'+server_id, token);
  },

  getUserServerInfo: () => {
    return actions.get('/action/servers');
  },

};

module.exports = api;
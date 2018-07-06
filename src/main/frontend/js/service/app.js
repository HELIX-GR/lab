const actions = require('./api/fetch-actions');

var api = {

  startJupyter: (server_id) => {
    return actions.get('/action/start/'+server_id);
  },

  getUserServerInfo: () => {
    return actions.get('/action/servers');
  },

};

module.exports = api;
const actions = require('./api/fetch-actions');

var api = {

  startJupyter: (server_id,token) => {
    return actions.post('/action/start/'+server_id, token);
  },

  stopJupyter: (server_id, token ) => {
    return actions.delete('/action/stop/'+server_id, token);
  },

  getUserServerInfo: () => {
    return actions.get('/action/servers');
  },

};

module.exports = api;
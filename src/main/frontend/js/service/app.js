const actions = require('./api/fetch-actions');

var api = {

  startJupyter: () => {
    return actions.get('/action/start');
  },

  getUserServerInfo: () => {
    return actions.get('/action/servers');
  },

};

module.exports = api;
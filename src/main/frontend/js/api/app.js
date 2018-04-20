const actions = require('./fetch-actions');

var api = {

  startJupyter: () => {
    return actions.get('/action/start');
  },

};

module.exports = api;
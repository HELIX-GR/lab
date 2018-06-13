const actions = require('./api/fetch-actions');

var api = {

  getServers: () => {
    return actions.get('/action/admin/servers');
  },  
  
  getUsers: () => {
    return actions.get('/action/admin/users');
  },

  addServer: (serverData, token) => {
    return actions.post('/action/admin/add_server', token, serverData);
  },
 
};

module.exports = api;
import * as actions from './api/fetch-actions';


const api = {
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

export default api;
import * as actions from './api/fetch-actions';


const api = {
  getServers: () => {
    return actions.get('/action/admin/servers');
  },  
  
  getUsers: () => {
    return actions.get('/action/admin/users');
  },

  getUsersToServers: () => {
    return actions.get('/action/admin/users_to_servers');
  },

  addServer: (serverData, token) => {
    return actions.post('/action/admin/add_server', token, serverData);
  },

  grandRole: (id, role, token) => {
    return actions.put('/action/admin/grand_role/'+id, token, role );
  },

  revokeRole: (id, role, token) => {
    return actions.put('/action/admin/revoke_role/'+id, token, role );
  },
 
};

export default api;
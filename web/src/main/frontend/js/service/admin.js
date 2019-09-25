import * as actions from './api/fetch-actions';


const api = {
  getServers: () => {
    return actions.get('/action/admin/servers');
  },

  getUsers: () => {
    return actions.get('/action/admin/users');
  },

  getUsersToServers: () => {
    return actions.get('/action/admin/servers/activity');
  },

  deleteUserToServer: (regId, token) => {
    return actions.delete(`action/admin/server/registration/${regId}`, token);
  },

  addServer: (serverData, token) => {
    return actions.post('/action/admin/server', token, serverData);
  },

  editServer: (id, serverData, token) => {
    return actions.post(`/action/admin/server/${id}`, token, serverData);
  },

  grantRole: (userId, role, token) => {
    return actions.post(`/action/admin/user/${userId}/role/${role}`, token);
  },

  revokeRole: (userId, role, token) => {
    return actions.delete(`/action/admin/user/${userId}/role/${role}`, token);
  },

  getWhiteList: () => {
    return actions.get('/action/admin/white-list/users');
  },

  addWhiteListUser: (userInfo, token) => {
    return actions.post('/action/admin/white-list/user', token, userInfo);
  },

  grantWhiteListRole: (userId, role, token) => {
    return actions.post(`/action/admin/white-list/user/${userId}/role/${role}`, token);
  },

  revokeWhiteListRole: (userId, role, token) => {
    return actions.delete(`/action/admin/white-list/user/${userId}/role/${role}`, token);
  },
};

export default api;
import actions from './api/fetch-actions';

export default {

  getServers: () => {
    return actions.get('/action/admin/servers');
  },

  getUsers: () => {
    return actions.get('/action/admin/users');
  },

  getUserServers: () => {
    return actions.get('/action/admin/servers/activity');
  },

  addServer: (server, token) => {
    return actions.post('/action/admin/server', token, server);
  },

  updateServer: (id, server, token) => {
    return actions.post(`/action/admin/server/${id}`, token, server);
  },

  removeUserServer: (regId, token) => {
    return actions.delete(`/action/admin/server/registration/${regId}`, token);
  },

  updateUser: (id, user, token) => {
    return actions.post(`/action/admin/user/${id}`, token, user);
  },

  grantUserRole: (userId, role, token) => {
    return actions.post(`/action/admin/user/${userId}/role/${role}`, token);
  },

  revokeUserRole: (userId, role, token) => {
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

import actions from './api/fetch-actions';

const EnumAction = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
};

const api = {

  addFavorite: (catalog, handle, title, description, url, token) => {
    const data = {
      action: EnumAction.ADD,
      catalog,
      handle,
      title,
      description,
      url,
    };
    return actions.post('/action/favorite', token, data);
  },

  removeFavorite: (catalog, handle, token) => {
    const data = {
      action: EnumAction.REMOVE,
      catalog,
      handle,
    };
    return actions.post('/action/favorite', token, data);
  },

  addCollection: (title, token) => {
    const data = {
      title,
    };
    return actions.post('/action/collection', token, data);
  },

  updateCollection: (id, title, token) => {
    const data = {
      id,
      title,
    };
    return actions.put('/action/collection', token, data);
  },

  removeCollection: (id, token) => {
    return actions.delete(`/action/collection/${id}`, token);
  },

  addFavoriteToCollection: (collection, favorite, token) => {
    return actions.post(`/action/collection/${collection}/favorite/${favorite}`, token, {});
  },

  removeFavoriteFromCollection: (collection, favorite, token) => {
    return actions.delete(`/action/collection/${collection}/favorite/${favorite}`, token);
  },

};

export default api;
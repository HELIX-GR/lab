import actions from './api/fetch-actions';

import { api as routes } from '../model/routes';

export default {

  search: (token, query) => {
    return actions.post(routes.SearchCkan, token, query);
  },

  searchById: (token, id) => {
    return actions.get(`/action/ckan/package/${id}`, token);
  },

  searchByKeyword: (token, term) => {
    return actions.get(`${routes.SearchCkan}?search=${term}`, token);
  },

};

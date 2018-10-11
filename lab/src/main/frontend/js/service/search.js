import * as actions from './api/fetch-actions';
import { api as routes } from '../model/routes';

export default {

  searchKeyword: (token, catalog, term) => {
    return actions.get(`${routes.SearchCkan}?catalog=${catalog}&search=${term}`, token);
  },

  searchById: (token, catalog, id) => {
    return actions.get(`'/action/ckan/queryById&id=${id}`, token);
  },

  search: (token, query) => {
    return actions.post(routes.SearchCkan, token, query);
  },

};

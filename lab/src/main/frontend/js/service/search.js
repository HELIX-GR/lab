import * as actions from './api/fetch-actions';
import { api as routes } from '../model/routes';

export default {

  searchKeyword: (token, catalog, term) => {
    return actions.get(`${routes.SearchAll}?catalog=${catalog}&search=${term}`, token);
  },

  search: (token, query) => {
    return actions.post(routes.SearchAll, token, query);
  },

};

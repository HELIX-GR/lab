import * as actions from './api/fetch-actions';
import { api as routes } from '../model/routes';

export default {

  searchKeyword: (token, term) => {
    return actions.get(`${routes.SearchCkan}?search=${term}`, token);
  },

  searchById: (token, id) => {
    return actions.get(`/action/ckan/package/${id}`, token);
  },

  search: (token, query) => {
    return actions.post(routes.SearchCkan, token, query);
  },

};

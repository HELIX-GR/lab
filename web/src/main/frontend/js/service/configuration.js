import actions from './api/fetch-actions';

export default {

  getConfiguration: (locale) => {
    return actions.get(`/action/configuration/${locale}`);
  },

};
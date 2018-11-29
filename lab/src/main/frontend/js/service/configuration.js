import * as actions from './api/fetch-actions';

const getConfiguration = (locale) => {
  return actions.get(`/action/configuration/${locale}`);
};

export default {
  getConfiguration,
};
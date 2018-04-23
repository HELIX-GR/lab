import * as actions from './fetch-actions';

const getConfiguration = () => {
  return actions.get('/action/configuration');
};

export default {
  getConfiguration,
};
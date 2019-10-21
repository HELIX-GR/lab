import _ from 'lodash';

import configurationService from '../service/configuration';

// Actions

const CONFIGURATION_REQUEST = 'config/CONFIGURATION_REQUEST';
const CONFIGURATION_SUCCESS = 'config/CONFIGURATION_SUCCESS';

// Reducer

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONFIGURATION_SUCCESS:
      return {
        ...state,
        ...action.configuration,
        // Sort kernels by index
        kernels: _.sortBy(action.configuration.kernels, ['index']),
      };

    default:
      return state;
  }
};

// Action Creators

const configurationRequest = () => ({
  type: CONFIGURATION_REQUEST,
});

const configurationSuccess = (configuration) => ({
  type: CONFIGURATION_SUCCESS,
  configuration,
});

// Thunk actions

export const getConfiguration = (locale) => (dispatch) => {

  dispatch(configurationRequest());

  return configurationService.getConfiguration(locale)
    .then((configuration) => {
      dispatch(configurationSuccess(configuration));
    });
};

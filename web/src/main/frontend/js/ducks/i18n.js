import i18n from '../service/i18n';
import moment from '../moment-localized';

import { setCookieValue } from '../util/cookie';

// Actions

const MESSAGES_REQUEST = 'locale/MESSAGES_REQUEST';
const MESSAGES_SUCCESS = 'locale/MESSAGES_SUCCESS';

// Reducer

const initialState = {
  locale: '',
  messages: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MESSAGES_SUCCESS: {
      moment.locale(action.locale);

      return {
        ...state,
        locale: action.locale,
        messages: {
          ...state.messages,
          [action.locale]: action.messages,
        }
      };
    }

    default:
      return state;
  }
};

// Action Creators
const messagesRequest = (locale) => ({
  type: MESSAGES_REQUEST,
  locale,
});

const messagesSuccess = (locale, messages) => ({
  type: MESSAGES_SUCCESS,
  locale,
  messages,
});

// Thunk actions

const getMessages = (locale) => (dispatch) => {
  dispatch(messagesRequest(locale));

  return i18n.getMessages(locale)
    .then(messages => dispatch(messagesSuccess(locale, messages)));
};

export const changeLocale = (locale) => (dispatch) => {
  setCookieValue('helix-cookie-locale', locale);

  return dispatch(getMessages(locale));
};

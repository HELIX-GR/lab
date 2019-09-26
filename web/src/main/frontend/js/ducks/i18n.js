import i18n from '../service/i18n';
import moment from '../moment-localized';

// Actions

const SET_LOCALE = 'locale/SET_LOCALE';

const MESSAGES_REQUEST = 'locale/MESSAGES_REQUEST';
const MESSAGES_SUCCESS = 'locale/MESSAGES_SUCCESS';

// Reducer

const initialState = {
  locale: '',
  messages: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCALE:
      return {
        ...state,
        locale: action.locale,
      };

    case MESSAGES_SUCCESS: {
      moment.locale(action.locale);

      const newState = { ...state };
      newState.messages[action.locale] = action.messages;
      return newState;
    }

    default:
      return state;
  }
};

// Action Creators

export const setLocale = (locale) => ({
  type: SET_LOCALE,
  locale,
});

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
    .then(r => dispatch(messagesSuccess(locale, r)));
};

export const changeLocale = (locale) => (dispatch) => {
  dispatch(setLocale(locale));

  return dispatch(getMessages(locale));
};

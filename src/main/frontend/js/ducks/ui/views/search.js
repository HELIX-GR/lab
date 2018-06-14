// Actions
const ADVANCED_SEARCH_TOGGLE = 'ui/search-page/ADVANCED_SEARCH_TOGGLE';
const PILL_TOGGLE = 'ui/search-page/PILL_TOGGLE';
const TEXT_CHANGE = 'ui/search-page/TEXT_CHANGE';

// Reducer
const initialState = {
  advanced: false,
  pills: {
    data: true,
    pubs: false,
    lab: false,
  },
  text: '',
};

export default (state = initialState, action) => {
  switch (action.type) {

    case ADVANCED_SEARCH_TOGGLE:
      return {
        ...state,
        advanced: !state.advanced,
      };

    case PILL_TOGGLE:
      return {
        ...state,
        pills: {
          ...state.pills,
          [action.id]: !state.pills[action.id],
        }
      };

    case TEXT_CHANGE:
      return {
        ...state,
        text: action.value,
      };

    default:
      return state;
  }
};

// Action creators
export const changeText = (value) => ({
  type: TEXT_CHANGE,
  value,
});

export const toggleAdvanced = () => ({
  type: ADVANCED_SEARCH_TOGGLE,
});

export const togglePill = (id) => ({
  type: PILL_TOGGLE,
  id,
});

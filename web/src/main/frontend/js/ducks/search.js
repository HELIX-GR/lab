// Services
import { default as catalogService } from '../service/search';

// Model
import {
  EnumFacet,
} from '../model';

// Actions

const ADVANCED_SEARCH_TOGGLE = 'ui/search-page/ADVANCED_SEARCH_TOGGLE';
const SET_RESULT_VISIBILITY = 'ui/search-page/SET_RESULT_VISIBILITY';
const SET_SEARCH_FACET = 'ui/search-page/SET_SEARCH_FACET';
const TEXT_CHANGE = 'ui/search-page/TEXT_CHANGE';

const SEARCH_REQUEST = 'ui/search-page/SEARCH_REQUEST';
const SEARCH_SUCCESS = 'ui/search-page/SEARCH_SUCCESS';

const SEARCH_AUTOCOMPLETE_REQUEST = 'ui/search-page/SEARCH_AUTOCOMPLETE_REQUEST';
const SEARCH_AUTOCOMPLETE_SUCCESS = 'ui/search-page/SEARCH_AUTOCOMPLETE_SUCCESS';

const NOTEBOOK_REQUEST = 'ui/search-page/NOTEBOOK_REQUEST';
const NOTEBOOK_SUCCESS = 'ui/search-page/NOTEBOOK_SUCCESS';

// Reducer

const initialState = {
  advanced: false,
  facets: Object.keys(EnumFacet).reduce((result, key) => { result[EnumFacet[key]] = []; return result; }, {}),
  loading: false,
  notebook: null,
  partialResult: {
    data: null,
    visible: false,
  },
  result: null,
  text: "",
};

const facetReducer = (state, action) => {
  switch (action.type) {
    case SET_SEARCH_FACET:
      return {
        ...state,
        [action.facet]: state[action.facet].find(value => value === action.value) ?
          state[action.facet].filter(value => value !== action.value) :
          [...state[action.facet], action.value],
      };

    default:
      return state;
  }
};

export default (state = initialState, action) => {
  switch (action.type) {

    case ADVANCED_SEARCH_TOGGLE:
      return {
        ...state,
        advanced: !state.advanced,
      };

    case SET_SEARCH_FACET:
      return {
        ...state,
        facets: facetReducer(state.facets, action),
      };

    case SET_RESULT_VISIBILITY:
      return {
        ...state,
        partialResult: {
          ...state.partialResult,
          visible: action.visible,
        },
      };

    case TEXT_CHANGE:
      return {
        ...state,
        text: action.value,
      };

    case SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SEARCH_AUTOCOMPLETE_REQUEST:
      return {
        ...state,
        loading: true,
        partialResult: {
          visible: false,
          data: null,
        }
      };

    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        result: action.data,
      };

    case SEARCH_AUTOCOMPLETE_SUCCESS:
      return {
        ...state,
        advanced: false,
        loading: false,
        partialResult: {
          visible: true,
          data: action.data,
        },
      };

    case NOTEBOOK_REQUEST:
      return {
        ...state,
        loading: true,
        notebook: null,
      };

    case NOTEBOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        notebook: action.data || null,
      };

    default:
      return state;
  }
};

// Action creators

export const setText = (value) => ({
  type: TEXT_CHANGE,
  value,
});

export const toggleAdvanced = () => ({
  type: ADVANCED_SEARCH_TOGGLE,
});

export const toggleSearchFacet = (facet, value) => ({
  type: SET_SEARCH_FACET,
  facet,
  value,
});

export const setResultVisibility = (visible) => ({
  type: SET_RESULT_VISIBILITY,
  visible,
});

const searchByKeywordRequest = (term) => ({
  type: SEARCH_AUTOCOMPLETE_REQUEST,
  term,
});

const searchByKeywordSuccess = (data) => ({
  type: SEARCH_AUTOCOMPLETE_SUCCESS,
  data,
});


const searchRequest = (term) => ({
  type: SEARCH_REQUEST,
  term,
});

const searchSuccess = (data) => ({
  type: SEARCH_SUCCESS,
  data,
});

const notebookRequest = (id) => ({
  type: NOTEBOOK_REQUEST,
  id,
});

const notebookSuccess = (data) => ({
  type: NOTEBOOK_SUCCESS,
  data,
});

// Thunk actions

export const searchAutoComplete = (term) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(searchByKeywordRequest(term));

  return catalogService.searchByKeyword(token, term)
    .then((data) => {
      dispatch(searchByKeywordSuccess(data));
      return data;
    });
};

export const search = (term, advanced = false, pageIndex = 0, pageSize = 10) => (dispatch, getState) => {
  const { meta: { csrfToken: token }, ui: { search: { facets } } } = getState();

  dispatch(setText(term));
  dispatch(searchRequest(term));

  return catalogService.search(token, {
    pageIndex,
    pageSize,
    term,
    facets: advanced ? facets : null,
  })
    .then((data) => {
      dispatch(searchSuccess(data));
      return (data);
    });
};

export const searchById = (id) => (dispatch, getState) => {
  const { meta: { csrfToken: token } } = getState();

  dispatch(notebookRequest(id));

  return catalogService.searchById(token, id)
    .then((data) => {
      dispatch(notebookSuccess(data));
      return (data);
    });
};

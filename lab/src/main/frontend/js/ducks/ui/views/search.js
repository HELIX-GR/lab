// Services
import { default as catalogService } from '../../../service/search';

// Model
import {
  EnumCatalog,
  EnumFacet,
} from '../../../model';

// Actions
const ADVANCED_SEARCH_TOGGLE = 'ui/search-page/ADVANCED_SEARCH_TOGGLE';
const PILL_TOGGLE = 'ui/search-page/PILL_TOGGLE';
const SET_RESULT_VISIBILITY = 'ui/search-page/SET_RESULT_VISIBILITY';
const SET_SEARCH_FACET = 'ui/search-page/SET_SEARCH_FACET';
const TEXT_CHANGE = 'ui/search-page/TEXT_CHANGE';

const SEARCH_REQUEST = 'ui/search-page/SEARCH_REQUEST';
const SEARCH_RESPONSE = 'ui/search-page/SEARCH_RESPONSE';

const SEARCH_AUTOCOMPLETE_REQUEST = 'ui/search-page/SEARCH_AUTOCOMPLETE_REQUEST';
const SEARCH_AUTOCOMPLETE_RESPONSE = 'ui/search-page/SEARCH_AUTOCOMPLETE_RESPONSE';

// Reducer
const initialState = {
  advanced: false,
  facets: Object.keys(EnumFacet).reduce((result, key) => { result[EnumFacet[key]] = []; return result; }, {}),
  loading: false,
  partialResult: {
    visible: false,
    catalogs: {},
  },
  pills: {
    data: true,
    pubs: false,
    lab: false,
  },
  result: {
    catalogs: {},
  },
  text: "",
};

function facetReducer(state, action) {
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
}

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
          data: false,
          pubs: false,
          lab: false,
          [action.id]: true,
        },
        partialResult: {
          visible: false,
          catalogs: {},
        }
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
          catalogs: {},
        }
      };

    case SEARCH_RESPONSE:
      return {
        ...state,
        loading: false,
        result:  action.data,
      };

    case SEARCH_AUTOCOMPLETE_RESPONSE:
      return {
        ...state,
        advanced: false,
        loading: false,
        partialResult: {
          visible: true,
          catalogs: action.data,
        },
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

export const toggleSearchFacet = (facet, value) => ({
  type: SET_SEARCH_FACET,
  facet,
  value,
});

export const setResultVisibility = (visible) => ({
  type: SET_RESULT_VISIBILITY,
  visible,
});

const catalogSearchKeywordBegin = (catalog, term) => ({
  type: SEARCH_AUTOCOMPLETE_REQUEST,
  catalog,
  term,
});

const catalogSearchKeywordComplete = (data) => ({
  type: SEARCH_AUTOCOMPLETE_RESPONSE,
  data,
});


const catalogSearchBegin = (term) => ({
  type: SEARCH_REQUEST,
  term,
});

const catalogSearchComplete = (data) => ({
  type: SEARCH_RESPONSE,
  data,
});

// Thunk actions
export const searchAutoComplete = (term) => (dispatch, getState) => {
  const { meta: { csrfToken: token }, ui: { search: { pills } } } = getState();

  const catalog = pills.data ? EnumCatalog.CKAN : pills.pubs ? EnumCatalog.OPENAIRE : EnumCatalog.NONE;

  dispatch(catalogSearchKeywordBegin(catalog, term));
  return catalogService.searchKeyword(token, catalog, term)
    .then((data) => {
      console.log(data);
      dispatch(catalogSearchKeywordComplete(data));
      return data;
    })
    .catch((err) => {
      // TODO: Add error handling
      console.error('Failed loading catalog data:', err);
    });
};

export const search = (term, advanced = false, pageIndex = 0, pageSize = 10) => (dispatch, getState) => {
  const { meta: { csrfToken: token }, ui: { search: { facets } } } = getState();

  const querie = {
    pageIndex,
    pageSize,
    term,
    facets: advanced ? facets : null,
  };

  dispatch(catalogSearchBegin(term));
  return catalogService.search(token, { 
    pageIndex,
    pageSize,
    term,
    facets: advanced ? facets : null,
  } )
    .then((data) => {
      dispatch(catalogSearchComplete(data));
      return (data);
    })
    .catch((err) => {
      // TODO: Add error handling
      console.error('Failed loading catalog data:', err);
    });
};


export const searchById = (id) => (dispatch, getState) => {
  const { meta: { csrfToken: token }, ui: { search: { facets } } } = getState();

  return catalogService.searchById(token, id)
    .then((data) => {
      dispatch(catalogSearchComplete(data));
      return (data);
    })
    .catch((err) => {
      // TODO: Add error handling
      console.error('Failed loading catalog data:', err);
    });
};

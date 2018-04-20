const appService = require('../api/app');

export const START_NOW = 'app/START_NOW';
const GOT_SERVER= 'app/GOT_SERVER';

var initialState = {
  success: null,
  error: null,
  loading: null,
  statistics: null,
  target:null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case START_NOW:
      return initialState;
    case GOT_SERVER:
      return {
        ...state,
        target:action.target,  
      }

    default:
      return state;
  }
};

const got_server = (r,t) => ({
  type: GOT_SERVER,
  target: r,

});

// Thunk actions
export const startNowAction = (username, password) => (dispatch, getState) => {
  var { meta: { csrfToken: token } } = getState();
  return appService.startJupyter().then(
    (r) => { console.log(r);
      dispatch(got_server(r));
    },
    (err) => {console.log(err);
      console.error('Failed login: ' + err.message);
      throw err;
    });
};


import * as Redux from 'redux';
import * as ReduxLogger from 'redux-logger';
import * as ReduxThunk from 'redux-thunk';

import { routerMiddleware } from 'react-router-redux';
import rootReducer from './reducers';
import { history } from './history';


// Create and configure store

var middleware = [
  ReduxThunk.default, // lets us dispatch functions
  //routerMiddleware(history),

];

/* global process */
//if (process.env.NODE_ENV != 'production') {
  // The logger middleware should always be last
  middleware.push(ReduxLogger.createLogger({ colors: {} }));
//}

var initialState = {};
var store = Redux.createStore(
  rootReducer, initialState, Redux.applyMiddleware(...middleware)
);

export default store;

import * as Redux from 'redux';
import * as ReduxLogger from 'redux-logger';
import * as ReduxThunk from 'redux-thunk';

import { routerMiddleware } from 'connected-react-router';

import { history } from './history';

import createRootReducer from './reducers';

// Create and configure store

const middleware = [
  // Support dispatching of functions
  ReduxThunk.default,
  // Intercept navigation actions
  routerMiddleware(history),
];

/* global process */

if (process.env.NODE_ENV != 'production') {
  // The logger middleware should always be last
  middleware.push(ReduxLogger.createLogger({ colors: {} }));
}

const initialState = {};

const store = Redux.createStore(
  createRootReducer(history),
  initialState,
  Redux.applyMiddleware(...middleware)
);

export default store;

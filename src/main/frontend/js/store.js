const Redux = require('redux');
const ReduxLogger = require('redux-logger');
const ReduxThunk = require('redux-thunk');

const rootReducer = require('./reducers');

// Create and configure store

var middleware = [
  ReduxThunk.default, // lets us dispatch functions
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

module.exports = store;
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as ReactDOM from 'react-dom';

import { ConnectedRouter } from 'connected-react-router';
import { history } from './history';

import store from './store';
import Root from './components/root.js';

var renderRoot = function (placeholder) {
  ReactDOM.render(
    <ReactRedux.Provider store={store}>
      <ConnectedRouter history={history}>
        <Root />
      </ConnectedRouter>
    </ReactRedux.Provider>,
    placeholder);
};

export default renderRoot;
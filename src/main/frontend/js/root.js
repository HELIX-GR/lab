import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from 'react-router-dom';
import * as ReactIntl from 'react-intl';

import { Provider } from "react-redux";

import App from "./components/App.js";
import store from "./store";


var renderRoot = function (placeholder) {
    ReactDOM.render(
    <Provider store={store}>
        <ReactIntl.IntlProvider>
            <BrowserRouter>
                {/* wrap connected component in a Route to be aware of navigation */}
                <Route path="/" component={App} />
            </BrowserRouter>
        </ReactIntl.IntlProvider>
    </Provider>,
    placeholder);
};

module.exports = { renderRoot };


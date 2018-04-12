import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./components/App.js";
import store from "./store";


var renderRoot = function (placeholder) {
    ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    placeholder);
};

module.exports = { renderRoot };


const store = require('./store');
const { renderRoot } = require('./root');

import { setCsrfToken } from './ducks/meta';


var rootSelector = document.currentScript.getAttribute('data-root') || '#root';

// Bind top-level event handlers

document.addEventListener("DOMContentLoaded", function () {
  var rootEl = document.querySelector(rootSelector);

  // Todo read from non-httponly "language" cookie

  var token = document.querySelector("meta[name=_csrf]")
    .getAttribute('content');

  // Chain preliminary actions before initial rendering

  Promise.resolve()
    .then(() => store.dispatch(setCsrfToken(token)))
    .then(() => renderRoot(rootEl));
});


import store from './store';
import renderRoot from './root';
import { getCookieValue } from './util/cookie';

import { setCsrfToken } from './ducks/meta';
import { changeLocale } from './ducks/i18n';
import { refreshProfile } from './ducks/user';
import { getConfiguration } from './ducks/config';

const rootSelector = document.currentScript.getAttribute('data-root') || '#root';

// Bind top-level event handlers

document.addEventListener("DOMContentLoaded", function () {
  const rootEl = document.querySelector(rootSelector);

  // TODO: read from non-httponly "locale" cookie
  const locale = getCookieValue('helix-cookie-locale') || 'en-GB';

  const token = document.querySelector("meta[name=_csrf]")
    .getAttribute('content');

  // Chain preliminary actions before initial rendering

  Promise.resolve()
    .then(() => store.dispatch(setCsrfToken(token)))
    .then(() => store.dispatch(changeLocale(locale)))
    .then(() => store.dispatch(getConfiguration(locale)))
    .then(() => store.dispatch(refreshProfile())
      // recover from an "Unauthorized" error
      .catch(() => console.error('Cannot refresh user profile')))
    .then(() => renderRoot(rootEl));
});


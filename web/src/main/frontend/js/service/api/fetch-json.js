import fetch from 'isomorphic-fetch';

import checkError from '../util/check-json';
import checkStatus from '../util/check-fetch-status';

export default (url, method, token, body, headers) => fetch(url, {
  method,
  headers: {
    ...headers,
    'x-csrf-token': token,
  },
  credentials: 'same-origin',
  body,
})
  .then(checkStatus)
  .then(response => response.json())
  .then(checkError)
  .then(response => response.result);

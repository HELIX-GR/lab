/**
 * A handler that can be chained to a fetch promise to reject non
 * successful (ie non 2xx) HTTP requests
 *
 * @param {any} result The response object
 * 
 * @returns The response if a 2xx HTTP status code is returned; Otherwise the
 * an exception is thrown
 */
const checkStatus = (result) => {
  if (result.status >= 200 && result.status < 300) {
    return result;
  } else {
    var err = new Error(`Received: ${result.status} ${result.statusText}`);
    throw err;
  }
};

export default checkStatus;
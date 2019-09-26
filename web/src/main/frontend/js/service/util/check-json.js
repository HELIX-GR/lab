import _ from 'lodash';

import {
  ServerError,
} from '../../model/error';

const checkError = (response) => {
  if (_.isEmpty(response.errors)) {
    return response;
  } else {
    throw new ServerError(response.errors);
  }
};

export default checkError;
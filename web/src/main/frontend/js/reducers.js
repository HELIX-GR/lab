import {
  combineReducers,
} from "redux";

import admin from './ducks/admin';
import config from "./ducks/config";
import filesystem from './ducks/filesystem';
import i18n from './ducks/i18n';
import meta from './ducks/meta';
import notebook from './ducks/notebook';
import search from './ducks/search';
import server from "./ducks/server";
import user from './ducks/user';
import viewport from './ducks/viewport';

export default combineReducers({
  admin,
  config,
  filesystem,
  i18n,
  meta,
  notebook,
  server,
  ui: combineReducers({
    search,
    viewport,
  }),
  user,
});
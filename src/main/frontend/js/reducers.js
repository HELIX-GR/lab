import {combineReducers} from "redux";

import config from "./ducks/config";
import app from "./ducks/app";
import i18n from './ducks/i18n';
import user from './ducks/user';
import meta from './ducks/meta';
import admin from './ducks/admin';

import {
  viewport,
} from './ducks/ui/';

import {
  search,
} from './ducks/ui/views';


export default combineReducers({  config,
  app,
  i18n,
  user,
  ui: combineReducers({
    search,
    viewport,
  }),
  meta,
  admin,
});
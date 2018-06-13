import {combineReducers} from "redux";

import config from "./ducks/config";
import app from "./ducks/app";
import users from './ducks/users';
import meta from './ducks/meta';
import admin from './ducks/admin';
//import actionRule from "./actionRule";
//import condition from "./condition";

module.exports = combineReducers({
  config,
  app,
  users,
  meta,
  admin,
})
import {combineReducers} from "redux";

import app from "./ducks/app";
import users from './ducks/users';
import meta from './ducks/meta';

//import actionRule from "./actionRule";
//import condition from "./condition";

module.exports = combineReducers({
  app,
  users,
  meta
})
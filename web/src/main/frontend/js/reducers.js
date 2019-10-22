import * as Redux from 'redux';

import { connectRouter } from 'connected-react-router';

import admin from './ducks/admin';
import courseProfessor from './ducks/course-professor';
import courseStudent from './ducks/course-student';
import config from "./ducks/config";
import filesystem from './ducks/filesystem';
import i18n from './ducks/i18n';
import meta from './ducks/meta';
import notebook from './ducks/notebook';
import search from './ducks/search';
import server from "./ducks/server";
import user from './ducks/user';
import viewport from './ducks/viewport';

export default (history) => Redux.combineReducers({
  admin,
  config,
  courses: Redux.combineReducers({
    professor: courseProfessor,
    student: courseStudent,
  }),
  filesystem,
  i18n,
  meta,
  notebook,
  router: connectRouter(history),
  server,
  ui: Redux.combineReducers({
    search,
    viewport,
  }),
  user,
});
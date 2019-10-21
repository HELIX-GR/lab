import {

} from './role';

export {
  buildPath,
  DynamicRoutes,
  ErrorPages,
  ExternalRoutes,
  Pages,
  StaticRoutes,
} from './routes';

export {
  EnumAuthProvider,
  EnumCatalog,
  EnumCkanFacet,
  EnumCourseAction,
  EnumFacet,
  EnumLocale,
} from './enum';

export {
  WordPressPages,
} from './wordpress-pages';

export {
  ServerError,
} from './error';

import {
  ALL,
  LAB,
  ADMIN,
  DEVELOPER,
  STANDARD,
  STANDARD_STUDENT,
  STANDARD_ACADEMIC,
  BETA,
  BETA_STUDENT,
  BETA_ACADEMIC,
} from './role';

export const RoleGroups = {
  ALL,
  LAB,
};

export const Roles = {
  ADMIN,
  DEVELOPER,
  STANDARD,
  STANDARD_STUDENT,
  STANDARD_ACADEMIC,
  BETA,
  BETA_STUDENT,
  BETA_ACADEMIC,
};

export {
  RoleNames,
} from './role';
import * as RoleNames from './role';

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

export const Roles = {
  ...RoleNames,
};
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
  EnumFacet,
  EnumLocale,
} from './enum';

export {
  WordPressPages,
} from './wordpress-pages';

export const Roles = {
  ...RoleNames,
};
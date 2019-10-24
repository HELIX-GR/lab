/**
 * Libraries
 */
import pathToRegexp from 'path-to-regexp';

/**
 * External routes
 */
export const ExternalRoutes = {
  Data: 'https://data.hellenicdataservice.gr',
  Lab: 'https://lab.hellenicdataservice.gr',
  Pubs: 'https://pubs.hellenicdataservice.gr',
};

/**
 * Static routes
 */
const ACTIONS = 'https://hellenicdataservice.gr/news/actions/';
const ADMIN = '/admin/';
const COLLECTIONS = 'https://hellenicdataservice.gr/collections/';
const CORE = 'https://hellenicdataservice.gr';
const COURSES = '/courses';
const COURSES_ADMIN = '/courses/admin';
const EVENTS = 'https://hellenicdataservice.gr/news/events/';
const FAVORITES = 'https://hellenicdataservice.gr/favorites/';
const FILESYSTEM = '/filesystem/';
const HOME = '/';
const PROFILE = 'https://hellenicdataservice.gr/profile/';
const NEWS = 'https://hellenicdataservice.gr/news/';
const NOTEBOOK_VIEWER = 'http://nbviewer.jupyter.org';
const PROJECT = 'https://hellenicdataservice.gr/project/';
const RESULTS = '/results/';

const GOOGLE = '/login/google';
const GITHUB = '/login/github';
const HELIX = '/login/helix';
const SAML = '/saml/login';

export const StaticRoutes = {
  ACTIONS,
  ADMIN,
  COLLECTIONS,
  CORE,
  COURSES,
  COURSES_ADMIN,
  EVENTS,
  FAVORITES,
  FILESYSTEM,
  HOME,
  LOGIN: {
    GITHUB,
    GOOGLE,
    HELIX,
    SAML,
  },
  NEWS,
  NOTEBOOK_VIEWER,
  PROFILE,
  PROJECT,
  RESULTS,
};

/**
 * Dynamic routes
 */
const NEWS_DETAILS = 'https://hellenicdataservice.gr/news/view/:id';
const NOTEBOOK_DETAILS = '/notebook/:id';
const PROJECT_PAGE = 'https://hellenicdataservice.gr/project/page/:name';


export const DynamicRoutes = {
  NEWS_DETAILS,
  NOTEBOOK_DETAILS,
  PROJECT_PAGE,
};

/**
 * Routes for utility pages
 */
const Login = '/login';
const Register = '/register';
const ResetPassword = '/reset-password';

export const Pages = {
  Login,
  Register,
  ResetPassword,
};

/**
 * Routes for error pages
 */
const Forbidden = '/error/403';
const NotFound = '/error/404';

export const ErrorPages = {
  Forbidden,
  NotFound,
};

/**
 * API routes
 */
export const api = {
  SearchCkan: '/action/ckan/query',
};

/**
 * Default links
 */
const routes = {
  // Pages
  [Login]: {
    description: 'Login to HELIX application',
  },
  [Register]: {
    description: 'Register a new account',
  },
  [ResetPassword]: {
    description: 'Reset password',
  },
  // Error Pages
  [Forbidden]: {
    description: 'Forbidden',
  },
  [NotFound]: {
    description: 'Not Found',
  },
};

/**
 * Find a route by its path e.g. /login
 *
 * @export
 * @param {string} path - the route path
 * @returns the route properties
 */
export function getRoute(path) {
  const prop = matchRoute(path);

  return routes[prop] || null;
}

/**
 * Matches the given path to an existing route and returns the route or null
 * if no match is found
 *
 * @export
 * @param {any} path - the route path to match
 * @returns the route that matched the given path or null if no match is found
 */
export function matchRoute(path) {
  for (let route in routes) {
    let re = pathToRegexp(route);
    if (re.test(path)) {
      return route;
    }
  }

  return null;
}

/**
 * Build a path given a route and optional parameters
 *
 * @export
 * @param {string} path - The route name
 * @param {string[]|object} params - Optional parameters to bind
 */
export function buildPath(path, params) {
  let result = path || '/';

  if (params) {
    if (Array.isArray(params)) {
      let re = /:\w+/i;
      for (const value of params) {
        result = result.replace(re, value);
      }
    } else {
      let toPath = pathToRegexp.compile(path);
      result = toPath(params);
    }
  }
  return result;
}

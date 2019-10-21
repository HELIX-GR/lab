export const USER = 'ROLE_USER';
export const ADMIN = 'ROLE_ADMIN';
export const DEVELOPER = 'ROLE_DEVELOPER';

export const STANDARD = 'ROLE_STANDARD';
export const STANDARD_STUDENT = 'ROLE_STANDARD_STUDENT';
export const STANDARD_ACADEMIC = 'ROLE_STANDARD_ACADEMIC';

export const BETA = 'ROLE_BETA';
export const BETA_STUDENT = 'ROLE_BETA_STUDENT';
export const BETA_ACADEMIC = 'ROLE_BETA_ACADEMIC';

export const ALL = [
  ADMIN,
  DEVELOPER,
  USER,
  STANDARD,
  STANDARD_STUDENT,
  STANDARD_ACADEMIC,
  BETA,
  BETA_STUDENT,
  BETA_ACADEMIC,
];

export const LAB = [
  STANDARD,
  STANDARD_STUDENT,
  STANDARD_ACADEMIC,
  BETA,
  BETA_STUDENT,
  BETA_ACADEMIC,
];

export const RoleNames = {
  [ADMIN]: 'System Admin',
  [DEVELOPER]: 'HELIX Developer',
  [USER]: 'Default Role',
  [STANDARD]: 'Standard',
  [STANDARD_STUDENT]: 'Standard Student',
  [STANDARD_ACADEMIC]: 'Standard Academic',
  [BETA]: 'Beta Tester',
  [BETA_STUDENT]: 'Beta Tester Student',
  [BETA_ACADEMIC]: 'Beta Tester Academic',
};

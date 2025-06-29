export const AuthPoints = {
  login: 'auth/login',
  register: 'auth/register',
  organization: 'auth/organization',
  contactInfo: 'auth/contact-information',
  getCountries: 'reference-data/countries',
  logoUpload: 'auth/logo-upload',
};
export const EndPoints = {
  getUsers: 'user/users',
  getRoles: 'reference-data/organization-roles',
  getDepts: 'reference-data/departments',
  createUser: 'user/user',
  getUserRoles: 'management/users/user-roles',
  modifyUser: 'user/modify-user',
  toggleUserStatus: 'user/modify-user-status',
};

export const AuditPoints = {
  getAuditPlans: 'audit-plan/audit-plans/year/',
  getAuditYears: 'audit-plan/audit-year',
  getPlanAudit: 'audit-plan/audit-plan/',
  createAuditPlan: 'audit-plan/audit-plan',
  modifyAudit: 'audit-plan/modify-audit-plan',
  currentYearPlans: 'audit-plan/current-year-audit-plans/organization/',
};

export interface RatingOption {
  rating: number;
  description: string;
  color: string;
}

export interface RatingScale {
  points: number;
  name: string;
  options: RatingOption[];
}
export interface LoginPayload {
  emailAddress: string;
  password: string;
  organizationCode: string;
  ipAddress: string;
}

export interface LoginResponse {
  data: Data;
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}

export interface Data {
  token: string;
  expiration: string;
  refreshToken: string;
  user: User;
}

export interface User {
  userId: string;
  username: string;
  fullname: string;
  email: string;
  userRole: string;
  defaultLanguage: string;
  permissions: Permission[];
}

export interface Permission {
  isDeleted: boolean;
  createdBy: string;
  dateCreated: string;
  updatedBy: string;
  dateUpdated: string;
  permissionId: number;
  moduleId: number;
  permissionName: string;
  subModuleUrl: string;
  arrangement: number;
  status: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  businessName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  data: RegisterData;
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}

export interface RegisterData {
  organizationId: string;
  userId: string;
  username: string;
  email: string;
  message: string;
  token: string;
  expiration: string;
  refreshToken: string;
}

export interface OrganizationPayload {
  companyId: string;
  companyName: string;
  preferredName: string;
  exchangeListed: boolean;
  exchangeName: [string];
  primaryDomain: string;
  countryId: number;
  address: string;
  numberOfEmployees: string;
  annualTurnOver: string;
  zipCode: string;
  industry: string;
  groupMember: boolean;
  groupOrganizationName: string;
  individualCompany: boolean;
}
export interface OrganizationResponse {
  data: OrganizationPayloadResponse;
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}

export interface OrganizationPayloadResponse {
  data: {
    organizationId: string;
    message: string;
  };
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}

export interface UserData {
  userId: string;
  username: string;
  fullname: string;
  email: string;
  permission: string;
  organizationRole: string;
  department: string | null;
  defaultLanguage: string;
  userStatus: string;
}
export interface UserResponse {
  data: UserData[];
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
  totalCount: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
export interface UserPayload {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
}
export interface Role {
  id: number;
  roleName: string;
}

export interface RoleResponse {
  data: Role[];
}
export interface CreaeteAuditPlanReponse extends GenericApiResponse {
  data: {
    message: string;
  };
}

export interface GenericApiResponse {
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}
export interface Department {
  id: number;
  name: string;
}

export interface DepartmentResponse {
  data: Department[];
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}
export interface CreateUserPayload {
  organizationId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  countryId: number;
  phoneNumber: string;
  roleId: string;
  organizationRoleId: number;
  department: string;
}

export interface ModifyStatusPayload {
  userId: string;
  userStatus: string;
}
export interface CreateAuditPayload {
  organizationId: string;
  departmentId: number;
  auditTitle: string;
  proposedTiming: string;
  auditYear: string;
}
export interface UserModel {
  organizationId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  countryId: number;
  phoneNumber: string;
  roleId: string;
  organizationRoleId: number;
}

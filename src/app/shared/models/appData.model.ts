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
  ipAddress: string;
  firstName?: string;
  lastName?: string;
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
  exchangeName: string;
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
  organizationId: string;
  message: string;
}

export interface Finding {
  id: string;
  closureDate: Date;
  priority: 'Major' | 'Minor';
  title: string;
  category: string;
  description: string;
  recommendation: string;
  status: 'Open' | 'Closed';
  issueOwner?: string;
  managementActionPlan?: string;
  typeOfClosure?: string;
  dateRemediated?: Date;
  rationalForClosingIssue?: string;
  selected?: boolean;
  bookmarked?: boolean;
  frozen?: boolean;
}

// API Models for Audit Findings
export interface AuditFinding {
  auditFindingId: string;
  organizationId: string;
  serialNumber: string;
  agreedClosureDate: string;
  priorityLevel: string;
  findingTitle: string;
  findingCategory: string;
  auditObservation: string;
  recommendation: string;
  issueOwner: string;
  managementActionPlan: string;
  reminder: string;
  reminderUser: string;
  bookmarked: boolean;
  freezeFindings: boolean;
}

export interface AuditFindingUser {
  userId: string;
  fullName: string;
  email: string;
}

export interface SavedFinding {
  auditPlanId: string;
  auditTitle: string;
  departmentId: number;
  department: string;
  auditYear: string;
  auditScopeSummary: string;
  pastDueDate: boolean;
  proposedTiming: string;
  changedProposedTime: string;
  status: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface CreateAuditFindingPayload {
  auditReportId: string;
  organizationId: string;
  serialNumber: string;
  agreedClosureDate: string;
  priorityLevel: string;
  findingTitle: string;
  findingCategory: string;
  auditObservation: string;
  recommendation: string;
  issueOwner: string;
  managementActionPlan: string;
  rootCause?: string;
  findingImpact?: string;
  reminder?: string;
  reminderUser?: string;
}

export interface ModifyAuditFindingPayload {
  auditFindingId: string;
  auditReportId: string;
  organizationId: string;
  serialNumber: string;
  agreedClosureDate: string;
  priorityLevel: string;
  findingTitle: string;
  findingCategory: string;
  auditObservation: string;
  recommendation: string;
  issueOwner: string;
  managementActionPlan: string;
  reminder?: string;
  reminderUser?: string;
}

export interface FreezeAuditFindingPayload {
  auditFindingId: string;
  organizationId: string;
  freezeFinding: boolean;
}

export interface BookmarkAuditFindingPayload {
  auditFindingId: string;
  organizationId: string;
  bookmark: boolean;
}

export interface AuditFindingResponse {
  data: AuditFinding[];
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
  totalCount?: number;
  totalPages?: number;
  pageSize?: number;
  pageNumber?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface AuditFindingUserResponse {
  data: AuditFindingUser[];
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}

export interface SavedFindingResponse {
  data: SavedFinding[];
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
  totalCount?: number;
  totalPages?: number;
  pageSize?: number;
  pageNumber?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface AuditFindingComment {
  id: number;
  auditFindingId: string;
  userId: string;
  username: string;
  comment: string;
  dateCreated: Date;
}

export interface AuditFindingCommentResponse {
  data: AuditFindingComment[];
  errorMessage: string;
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

export interface AuditFindingUpdate {
  id: number;
  auditFindingId: string;
  userId: string;
  username: string;
  action: string;
  comment: string;
  dateCreated: Date;
}

export interface AuditFindingUpdateResponse {
  data: AuditFindingUpdate[];
  errorMessage: string;
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

export interface SimpleMessageResponse {
  data: {
    message: string;
  };
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}

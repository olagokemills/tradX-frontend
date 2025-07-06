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
}

import { Component, EventEmitter, Output, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/users.service';
import { ReferenceService } from 'src/app/core/services/reference/reference.service';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { EncryptionService } from 'src/app/core/utils/encryption.service';
import { AuditLibraryService } from 'src/app/core/services/audit/audit-library.service';
import { AuditReport } from 'src/app/shared/models/audit-report.model';

@Component({
  selector: 'app-add-report-form',
  templateUrl: './add-report-form.component.html',
  styleUrls: ['./add-report-form.component.scss']
})
export class AddReportFormComponent implements OnInit, OnChanges {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();
  @Input() reportData: AuditReport | null = null; // For edit mode
  @Input() isEditMode: boolean = false;

  reportForm: FormGroup;
  loading = false;

  entities: string[] = [];
  entityValueMap: Record<string, string> = {}; // label -> value
  ratings: string[] = [];
  ratingValueMap: Record<string, string> = {}; // label -> value
  quarters: string[] = [];
  quarterValueMap: Record<string, string> = {}; // label -> value
  auditNames = ['Internal Audit', 'External Audit', 'Compliance Audit'];

  departments: string[] = [];
  departmentValueMap: Record<string, string> = {}; // label -> value

  userId: string | null = null;
  organizationMap: Record<string, any> = {};


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private referenceService: ReferenceService,
    private loginService: LoginService,
    private encryptionService: EncryptionService,
    private auditLibraryService: AuditLibraryService // <-- Inject the service
  ) {
    this.reportForm = this.fb.group({
      reportNumber: ['', Validators.required],
      reportDate: ['', Validators.required],
      entity: ['', Validators.required],
      organizationId: ['', Validators.required],
      overallRating: ['', Validators.required],
      otherUniqueIdentifier: [''],
      quarter: ['', Validators.required],
      auditName: ['', Validators.required],
      auditYear: ['', Validators.required],
      summaryScope: ['', Validators.required],
      department: ['', Validators.required]
    });
    // No need for auditNameOptions, auditNames is already string[]
  }


  ngOnInit(): void {
    // Get userId from encrypted storage (see onboarding.component.ts)
    const details = this.encryptionService.GetItem('user')?.data;
    this.userId = details?.user?.userId || details?.userId;

    // Load initial data
    this.loadInitialData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if reportData or isEditMode has changed
    if (changes['isEditMode'] && !this.isEditMode) {
      // Switching to create mode - reset form
      this.resetForm();
    } else if ((changes['reportData'] || changes['isEditMode']) && this.isEditMode && this.reportData) {
      console.log('Input changed - populating form for edit mode with data:', this.reportData, this.isEditMode);
      // Wait for initial data to load first, with a longer timeout to ensure departments are loaded
      this.waitForDataAndPopulate();
    }
  }

  private waitForDataAndPopulate(): void {
    // Check if all required data is loaded
    const checkDataLoaded = () => {
      if (this.entities.length > 0 && this.departments.length > 0 && this.quarters.length > 0) {
        console.log('All data loaded, populating form...');
        this.populateFormForEdit();
        return true;
      }
      return false;
    };

    // Try immediately
    if (!checkDataLoaded()) {
      // If not ready, wait and try again (max 10 attempts, 200ms each)
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (checkDataLoaded() || attempts >= 10) {
          clearInterval(interval);
          if (attempts >= 10) {
            console.warn('Timeout waiting for data to load, populating form anyway...');
            this.populateFormForEdit();
          }
        }
      }, 200);
    }
  }

  private resetForm(): void {
    this.reportForm.reset();
    // Reset form to initial state with validators
    this.reportForm.patchValue({
      reportNumber: '',
      reportDate: '',
      entity: '',
      organizationId: '',
      overallRating: '',
      otherUniqueIdentifier: '',
      quarter: '',
      auditName: '',
      auditYear: '',
      summaryScope: '',
      department: ''
    });
    this.ratings = [];
  }

  private loadInitialData(): void {
    if (this.userId) {
      // Use getUserById to fetch organizations
      this.loginService.getUserById(this.userId).subscribe({
        next: (res: any) => {
          const organizations = res?.data?.organizations || [];
          this.entities = organizations.map((org: any) => org.companyName);
          organizations.forEach((org: any) => {
            this.entityValueMap[org.companyName] = org.companyId;
          });

          // If editing, populate form after entities are loaded
          if (this.isEditMode && this.reportData) {
            this.populateFormForEdit();
            this.loadRatingsForEntity(this.reportData.organizationId);
          }
        },
        error: (err) => {
          console.error('Error fetching user organizations:', err);
        }
      });
    }

    // Get quarters
    this.referenceService.getQuarters().subscribe({
      next: (res) => {
        this.quarters = (res.data || []).map(q => q);
        (res.data || []).forEach(q => {
          this.quarterValueMap[q] = q;
        });

        // If editing, populate form after quarters are loaded (in case not done yet)
        if (this.isEditMode && this.reportData && this.entities.length > 0) {
          this.populateFormForEdit();
        }
      },
      error: (err) => {
        console.error('Error fetching quarters:', err);
      }
    });

    // Get departments
    this.referenceService.getDepartments().subscribe({
      next: (res) => {
        this.departments = (res.data || []).map((d: any) => d.name);
        (res.data || []).forEach((d: any) => {
          this.departmentValueMap[d.name] = d.id;
        });

        // If editing, populate form after departments are loaded (in case not done yet)
        if (this.isEditMode && this.reportData && this.entities.length > 0) {
          this.populateFormForEdit();
        }
      },
      error: (err) => {
        console.error('Error fetching departments:', err);
      }
    });
  }

  private populateFormForEdit(): void {
    if (!this.reportData) return;

    console.log('=== DEBUGGING DEPARTMENT FIELD ===');
    console.log('Report data department value:', this.reportData.department);
    console.log('Department type:', typeof this.reportData.department);
    console.log('Available departments:', this.departments);
    console.log('Department value map:', this.departmentValueMap);

    // Find entity name by organization ID
    const entityName = Object.keys(this.entityValueMap).find(
      name => this.entityValueMap[name] === this.reportData!.organizationId
    );

    // Find department name by department value
    // The department field in reportData might be an ID or name, let's check both
    let departmentName = Object.keys(this.departmentValueMap).find(
      name => this.departmentValueMap[name] === this.reportData!.department
    );

    console.log('Department name found by ID lookup:', departmentName);

    // If not found by ID, check if it's already a name
    if (!departmentName && this.departments.includes(this.reportData.department)) {
      departmentName = this.reportData.department;
      console.log('Department found by direct name match:', departmentName);
    }

    // If still not found, let's try string conversion
    if (!departmentName) {
      const deptValue = String(this.reportData.department);
      departmentName = Object.keys(this.departmentValueMap).find(
        name => this.departmentValueMap[name] === deptValue
      );
      console.log('Department name found by string conversion:', departmentName);
    }

    console.log('Final department name to use:', departmentName);
    console.log('=== END DEBUGGING ===');

    // Format date for date input (YYYY-MM-DD)
    const reportDate = this.reportData.reportDate ?
      new Date(this.reportData.reportDate).toISOString().split('T')[0] : '';

    const formValues = {
      reportNumber: this.reportData.reportNumber,
      reportDate: reportDate,
      entity: entityName || '',
      organizationId: this.reportData.organizationId,
      overallRating: this.reportData.overallRating,
      otherUniqueIdentifier: this.reportData.otherUniqueIdentifier,
      quarter: this.reportData.quarter,
      auditName: this.reportData.auditName,
      auditYear: this.reportData.auditYear,
      summaryScope: this.reportData.summaryScope,
      department: departmentName || ''
    };

    console.log('Populating form with values:', formValues);
    this.reportForm.patchValue(formValues);

    // Load ratings for the selected entity if not already loaded
    if (entityName && this.ratings.length === 0) {
      this.loadRatingsForEntity(this.reportData.organizationId);
    }
  }

  private loadRatingsForEntity(organizationId: string): void {
    this.userService.GetReportRatings(organizationId).subscribe({
      next: (res) => {
        this.ratings = (res.data || []).map(r => r.scaleDefinition);
        (res.data || []).forEach(r => {
          this.ratingValueMap[r.scaleDefinition] = r.id.toString();
        });
      },
      error: (err) => {
        console.error('Error fetching report ratings:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      this.loading = true;
      const formValue = this.reportForm.value;

      const payload = {
        organizationId: String(this.entityValueMap[formValue.entity] || formValue.organizationId),
        reportNumber: String(formValue.reportNumber),
        reportDate: formValue.reportDate ? new Date(formValue.reportDate).toISOString() : '',
        entity: String(this.entityValueMap[formValue.entity] || formValue.organizationId),
        overallRating: String(this.ratingValueMap[formValue.overallRating]),
        otherUniqueIdentifier: String(formValue.otherUniqueIdentifier),
        quarter: String(formValue.quarter),
        auditName: String(formValue.auditName),
        auditYear: String(formValue.auditYear),
        summaryScope: String(formValue.summaryScope),
        department: String(this.departmentValueMap[formValue.department])
      };

      if (this.isEditMode && this.reportData?.auditReportId) {
        // For edit mode, add the auditReportId to the payload
        const modifyPayload = {
          ...payload,
          auditReportId: this.reportData.auditReportId
        };

        this.auditLibraryService.ModifyAuditReport(modifyPayload).subscribe({
          next: (res) => {
            this.loading = false;
            this.submit.emit(res); // Notify parent to refresh data
            this.close.emit(); // Close modal after successful API call
          },
          error: (err) => {
            this.loading = false;
            console.error('Error updating report:', err);
          }
        });
      } else {
        // Call create endpoint for new reports
        this.auditLibraryService.CreateAuditReport(payload).subscribe({
          next: (res) => {
            this.loading = false;
            this.submit.emit(res); // Notify parent to refresh data
            this.close.emit(); // Close modal after successful API call
          },
          error: (err) => {
            this.loading = false;
            console.error('Error creating report:', err);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.close.emit();
  }

  onEntityChange(entityLabel: string): void {
    const companyId = this.entityValueMap[entityLabel];
    this.reportForm.patchValue({ organizationId: companyId });
    if (companyId) {
      this.userService.GetReportRatings(companyId).subscribe({
        next: (res) => {
          this.ratings = (res.data || []).map(r => r.scaleDefinition);
          (res.data || []).forEach(r => {
            this.ratingValueMap[r.scaleDefinition] = r.id.toString();
          });
        },
        error: (err) => {
          console.error('Error fetching report ratings:', err);
        }
      });
    } else {
      this.ratings = [];
    }
  }
}

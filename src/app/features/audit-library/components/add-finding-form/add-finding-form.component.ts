import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditFindingsService } from 'src/app/core/services/audit/audit-findings.service';
import { ReferenceService } from 'src/app/core/services/reference/reference.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-finding-form',
  templateUrl: './add-finding-form.component.html',
  styleUrls: ['./add-finding-form.component.scss']
})
export class AddFindingFormComponent implements OnInit, OnChanges {
  @Input() findingToEdit: any = null;
  @Input() auditReportId: string = '';
  @Input() organizationId: string = '';
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  findingForm: FormGroup;
  loading = false;
  isEditMode = false;
  loadingData = false;

  priorityOptions: string[] = [];
  categoryOptions: string[] = [];
  reminderOptions = ['1 day before', '2 days before', '1 week before'];
  userOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private auditFindingsService: AuditFindingsService,
    private referenceService: ReferenceService
  ) {
    this.findingForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadingData = true;

    // If we have a finding to edit, set edit mode to true
    if (this.findingToEdit) {
      this.isEditMode = true;
    }

    // Load all required data from APIs
    forkJoin({
      users: this.auditFindingsService.GetUserList(this.organizationId),
      categories: this.referenceService.getFindingCategories()
    }).subscribe({
      next: (results) => {
        // Process users list
        if (results.users.isSuccess && results.users.data) {
          this.userOptions = results.users.data.map((user: any) => ({
            label: user.name || user.fullName || user.email || 'User',
            value: user.id || user.userId || user.email
          }));
        }

        // Process categories
        if (results.categories.isSuccess && results.categories.data) {
          this.categoryOptions = results.categories.data;
        }

        // TODO: Add API call for priority ratings when available
        this.priorityOptions = ['High', 'Medium', 'Low'];

        // If in edit mode, populate the form with existing data
        if (this.isEditMode) {
          this.populateForm();
        }

        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error loading form data:', error);
        this.loadingData = false;

        // Set default values in case of error
        this.categoryOptions = ['Operational', 'Strategic', 'Financial', 'Compliance'];
        this.priorityOptions = ['High', 'Medium', 'Low'];
        this.userOptions = [];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If auditReportId changes
    console.log(' auditReportId:', this.auditReportId);

    if (changes['auditReportId'] && this.auditReportId) {
      console.log('Initializing AddFindingFormComponent with auditReportId:', this.auditReportId);

      this.auditReportId = changes['auditReportId'].currentValue;
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      serialNumber: [''], // Auto-generated for new findings
      agreedClosureDate: ['', Validators.required],
      priorityLevel: ['', Validators.required],
      findingTitle: ['', Validators.required],
      findingCategory: ['', Validators.required],
      auditObservation: ['', Validators.required],
      recommendation: ['', Validators.required],
      rootCause: [''],
      findingImpact: [''],
      issueOwner: ['', Validators.required],
      managementActionPlan: ['', Validators.required],
      reminder: ['1 week before'], // Default value
      reminderUser: ['']
    });
  }

  populateForm(): void {
    if (!this.findingToEdit) return;

    this.findingForm.patchValue({
      serialNumber: this.findingToEdit.serialNumber,
      agreedClosureDate: this.findingToEdit.agreedClosureDate
        ? new Date(this.findingToEdit.agreedClosureDate).toISOString().split('T')[0]
        : '',
      priorityLevel: this.findingToEdit.priorityLevel,
      findingTitle: this.findingToEdit.findingTitle,
      findingCategory: this.findingToEdit.findingCategory,
      auditObservation: this.findingToEdit.auditObservation,
      recommendation: this.findingToEdit.recommendation,
      rootCause: this.findingToEdit.rootCause || '',
      findingImpact: this.findingToEdit.findingImpact || '',
      issueOwner: this.findingToEdit.issueOwner,
      managementActionPlan: this.findingToEdit.managementActionPlan,
      reminderUser: this.findingToEdit.reminderUser || ''
    });
  }

  onSubmit() {
    // console.log('Form submitted:', this.findingForm);
    if (this.findingForm.valid) {
      this.loading = true;

      const formData = { ...this.findingForm.value };

      // Ensure agreed closure date is in ISO format
      if (formData.agreedClosureDate) {
        formData.agreedClosureDate = new Date(formData.agreedClosureDate).toISOString();
      }

      if (this.isEditMode) {
        // Update existing finding
        const updatePayload = {
          organizationId: this.organizationId,
          auditFindingId: this.findingToEdit.auditFindingId,
          ...formData
        };

        this.auditFindingsService.ModifyAuditFinding(updatePayload).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.submit.emit(response.data);
            } else {
              console.error('Error updating finding:', response.errorMessage);
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating finding:', error);
            this.loading = false;
          }
        });
      } else {
        console.log('Creating new finding with data:', this.auditReportId);
        // Create new finding
        const createPayload = {
          organizationId: this.organizationId,
          auditReportId: this.auditReportId,
          ...formData
        };

        this.auditFindingsService.CreateAuditFinding(createPayload).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.submit.emit(response.data);
            } else {
              console.error('Error creating finding:', response.errorMessage);
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error creating finding:', error);
            this.loading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

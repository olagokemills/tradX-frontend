import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/users.service';
import { ReferenceService } from 'src/app/core/services/reference/reference.service';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { EncryptionService } from 'src/app/core/utils/encryption.service';
import { AuditLibraryService } from 'src/app/core/services/audit/audit-library.service';

@Component({
  selector: 'app-add-report-form',
  templateUrl: './add-report-form.component.html',
  styleUrls: ['./add-report-form.component.scss']
})
export class AddReportFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  reportForm: FormGroup;
  loading = false;

  entities: string[] = [];
  entityValueMap: Record<string, string> = {}; // label -> value
  ratings: string[] = [];
  ratingValueMap: Record<string, string> = {}; // label -> value
  quarters: string[] = [];
  quarterValueMap: Record<string, string> = {}; // label -> value
  auditNames = ['Internal Audit', 'External Audit', 'Compliance Audit'];

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
      summaryScope: ['', Validators.required]
    });
    // No need for auditNameOptions, auditNames is already string[]
  }


  ngOnInit(): void {
    // Get userId from encrypted storage (see onboarding.component.ts)
    const details = this.encryptionService.GetItem('user')?.data;
    this.userId = details?.user?.userId || details?.userId;
    if (this.userId) {
      // Use getUserById to fetch organizations (see onboarding.component.ts)
      this.loginService.getUserById(this.userId).subscribe({
        next: (res: any) => {
          const organizations = res?.data?.organizations || [];
          this.entities = organizations.map((org: any) => org.companyName);
          organizations.forEach((org: any) => {
            this.entityValueMap[org.companyName] = org.companyId;
          });
          // No need for valueChanges subscription, will use selectChange event

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
      },
      error: (err) => {
        console.error('Error fetching quarters:', err);
      }
    });

  }

  onSubmit(): void {
    // console.log('Form Submitted:', this.reportForm);
    if (this.reportForm.valid) {
      this.loading = true;
      const formValue = this.reportForm.value;
      const payload = {
        organizationId: this.entityValueMap[formValue.entity],
        reportNumber: formValue.reportNumber,
        reportDate: formValue.reportDate,
        entity: this.entityValueMap[formValue.entity],
        overallRating: this.ratingValueMap[formValue.overallRating],
        otherUniqueIdentifier: formValue.otherUniqueIdentifier,
        quarter: formValue.quarter,
        auditName: formValue.auditName,
        auditYear: formValue.auditYear,
        summaryScope: formValue.summaryScope
      };
      this.auditLibraryService.CreateAuditReport(payload).subscribe({
        next: (res) => {
          // console.log('Audit Report Created:', res);
          this.loading = false;
          // Optionally emit or close modal here
          // this.submit.emit(res);
        },
        error: (err) => {
          // console.error('Error creating audit report:', err);
          this.loading = false;
        }
      });
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

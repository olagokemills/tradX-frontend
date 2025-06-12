import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RatingOption, RatingScale } from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-rating-info',
  templateUrl: './rating-info.component.html',
  styleUrls: ['./rating-info.component.scss'],
})
export class RatingInfoComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Input() RatingInfo: any | null = null;
  RatingForm!: FormGroup;

  selectedReportScale: number | '' = '';
  selectedFindingScale: number | '' = '';
  currentAuditReportRatingOptions: RatingOption[] = [];
  currentAuditFindingRatingOptions: RatingOption[] = [];

  auditReportRatingScale: RatingScale[] = [
    {
      points: 6,
      name: '6-Point Rating Scale',
      options: [
        {
          rating: 1,
          description:
            'Unsatisfactory - Significant and widespread control deficiencies exist. Immediate corrective action is required.',
          color: '#dc3545',
        },
        {
          rating: 2,
          description:
            'Weak - Major deficiencies in key controls. Risk exposure is high. Urgent improvement needed.',
          color: '#fd7e14',
        },
        {
          rating: 3,
          description:
            'Needs Improvement - Some key controls are not operating effectively or consistently. Medium risk exposure.',
          color: '#ffc107',
        },
        {
          rating: 4,
          description:
            'Satisfactory - Controls are generally effective, with minor weaknesses noted. Low to moderate risk.',
          color: '#20c997',
        },
        {
          rating: 5,
          description:
            'Strong - Control environment is well-designed and effectively implemented. Minimal risk exposure.',
          color: '#28a745',
        },
        {
          rating: 6,
          description:
            'Exemplary - Outstanding control framework with continuous improvement practices in place. Very low risk.',
          color: '#007bff',
        },
      ],
    },
    {
      points: 5,
      name: '5-Point Rating Scale',
      options: [
        {
          rating: 1,
          description:
            'Unsatisfactory - Major control weaknesses; serious risk exposure; urgent corrective action required.',
          color: '#dc3545',
        },
        {
          rating: 2,
          description:
            'Needs Improvement - Several deficiencies in control design or execution. Moderate to high risk exposure.',
          color: '#fd7e14',
        },
        {
          rating: 3,
          description:
            'Satisfactory - Controls are generally sound but with a few minor deficiencies. Moderate risk.',
          color: '#ffc107',
        },
        {
          rating: 4,
          description:
            'Good - Effective control environment with minor or low-impact issues. Low risk.',
          color: '#28a745',
        },
        {
          rating: 5,
          description:
            'Excellent - Strong and proactive controls in place. No significant issues identified. Very low risk.',
          color: '#007bff',
        },
      ],
    },
    {
      points: 4,
      name: '4-Point Rating Scale',
      options: [
        {
          rating: 1,
          description:
            'Poor - Major deficiencies with high risk; immediate remediation needed.',
          color: '#dc3545',
        },
        {
          rating: 2,
          description:
            'Fair - Some weaknesses; controls partially effective. Moderate risk.',
          color: '#ffc107',
        },
        {
          rating: 3,
          description:
            'Good - Controls are working as intended with few issues. Low risk.',
          color: '#28a745',
        },
        {
          rating: 4,
          description:
            'Excellent - Robust controls with no material weaknesses. Very low risk.',
          color: '#007bff',
        },
      ],
    },
    {
      points: 3,
      name: '3-Point Rating Scale',
      options: [
        {
          rating: 1,
          description:
            'Inadequate - Controls are insufficient or not functioning; high risk exposure.',
          color: '#dc3545',
        },
        {
          rating: 2,
          description:
            'Adequate - Controls are generally effective with minor gaps. Moderate to low risk.',
          color: '#ffc107',
        },
        {
          rating: 3,
          description:
            'Strong - Controls are robust and operating effectively. Very low risk.',
          color: '#28a745',
        },
      ],
    },
    {
      points: 2,
      name: '2-Point Rating Scale',
      options: [
        {
          rating: 1,
          description:
            'Unsatisfactory - Controls are ineffective or inadequate. Risks are not well managed.',
          color: '#dc3545',
        },
        {
          rating: 2,
          description:
            'Satisfactory - Controls are adequate and functioning as intended. Risk is acceptably managed.',
          color: '#28a745',
        },
      ],
    },
    {
      points: 1,
      name: '1-Point Rating Scale',
      options: [
        {
          rating: 1,
          description:
            'Unrated - Materiality or severity rating is not provided for the report',
          color: '#6c757d',
        },
      ],
    },
  ];
  auditFindingRatingScale: RatingScale[] = [
    {
      points: 6,
      name: '6-Point Rating Scale',
      options: [
        {
          rating: 1,
          description: 'Critical - Major control failure; severe impact',
          color: '#dc3545',
        },
        {
          rating: 2,
          description: 'High - Significant deficiency; high risk',
          color: '#fd7e14',
        },
        {
          rating: 3,
          description: 'Medium - Notable control gap; moderate risk',
          color: '#ffc107',
        },
        {
          rating: 4,
          description: 'Low - Minor control issue; low risk',
          color: '#20c997',
        },
        {
          rating: 5,
          description: 'Observation - Process improvement opportunity',
          color: '#28a745',
        },
        {
          rating: 6,
          description: 'Unrated - Informational or out-of-scope',
          color: '#007bff',
        },
      ],
    },
    {
      points: 5,
      name: '5-Point Rating Scale',
      options: [
        {
          rating: 1,
          description:
            'Critical - Major control failure; high likelihood of serious impact',
          color: '#dc3545',
        },
        {
          rating: 2,
          description:
            'High - Significant control weakness that may lead to material loss or compliance breach',
          color: '#fd7e14',
        },
        {
          rating: 3,
          description: 'Medium - Control deficiency with manageable impact',
          color: '#ffc107',
        },
        {
          rating: 4,
          description: 'Low - Minor weakness with little to no immediate risk',
          color: '#28a745',
        },
        {
          rating: 5,
          description:
            'Observation - No actual deficiency, but potential improvement noted for future enhancement',
          color: '#007bff',
        },
      ],
    },
    {
      points: 4,
      name: '4-Point Rating Scale',
      options: [
        {
          rating: 1,
          description: 'High - Serious issue with substantial risk',
          color: '#dc3545',
        },
        {
          rating: 2,
          description:
            'Medium - Notable issue; may affect performance or compliance',
          color: '#ffc107',
        },
        {
          rating: 3,
          description: 'Low - Minor control gap',
          color: '#28a745',
        },
        {
          rating: 4,
          description:
            'Observation - No breach, but opportunity to improve or streamline',
          color: '#007bff',
        },
      ],
    },
    {
      points: 3,
      name: '3-Point Rating Scale',
      options: [
        {
          rating: 1,
          description:
            'Significant - Major weakness with risk of loss or non-compliance	',
          color: '#dc3545',
        },
        {
          rating: 2,
          description:
            'Moderate - Manageable issue; may cause inefficiency or small exposure	',
          color: '#ffc107',
        },
        {
          rating: 3,
          description:
            'Minor/Observation - Not a control failure; possible improvement or note for awareness	',
          color: '#28a745',
        },
      ],
    },
    {
      points: 2,
      name: '2-Point Rating Scale',
      options: [
        {
          rating: 1,
          description:
            'Finding - A control deficiency or issue requiring action ',
          color: '#dc3545',
        },
        {
          rating: 2,
          description:
            'Observation - A recommendation or note; no immediate action required',
          color: '#28a745',
        },
      ],
    },
  ];
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.populateForm();
  }

  populateForm() {
    this.RatingForm = this.fb.group({
      fullName: [
        this.RatingInfo?.fullName || '',
        [Validators.minLength(6), Validators.required],
      ],
      emailAddress: [
        this.RatingInfo?.emailAddress || '',
        [Validators.minLength(6), Validators.required],
      ],
      phoneNumber: [
        this.RatingInfo?.phoneNumber || '',
        [Validators.minLength(6), Validators.required],
      ],
      role: [
        this.RatingInfo?.role || '',
        [Validators.minLength(6), Validators.required],
      ],
    });
    // if (this.ContactInfo) {
    //   this.ContactForm.patchValue({
    //     businessName: this.ContactInfo?.businessName || '',
    //     businessType: this.ContactInfo?.businessType || '',
    //     businessAddress: this.ContactInfo?.businessAddress || '',
    //     businessPhone: this.ContactInfo?.businessPhone || '',
    //   });
    // }
  }
  handleSubmit(data: any) {
    this.formSubmit.emit(this.RatingInfo);
  }

  onReportScaleChange(): void {
    console.log('ffff');
    console.log(this.selectedReportScale);
    if (this.selectedReportScale) {
      const scale = this.auditReportRatingScale.find(
        (s) => s.points == this.selectedReportScale
      );
      console.log(scale);
      this.currentAuditReportRatingOptions = scale ? [...scale.options] : [];
    } else {
      this.currentAuditReportRatingOptions = [];
    }
  }

  onFindingScaleChange(): void {
    console.log('ffff');
    console.log(this.selectedReportScale);
    if (this.selectedFindingScale) {
      const scale = this.auditFindingRatingScale.find(
        (s) => s.points == this.selectedFindingScale
      );
      console.log(scale);
      this.currentAuditFindingRatingOptions = scale ? [...scale.options] : [];
    } else {
      this.currentAuditFindingRatingOptions = [];
    }
  }

  trackByRating(index: number, item: RatingOption): number {
    return item.rating;
  }

  getShortDescription(description: string): string {
    return description.split(' - ')[0];
  }

  // Helper method for debugging
  logCurrentConfig() {
    console.log('Full Configuration:', this.getRatingConfiguration());
  }

  // Method to get the current configuration (useful for parent components)
  getRatingConfiguration() {
    return {
      scale: this.selectedReportScale,
      scaleName:
        this.auditReportRatingScale.find(
          (s) => s.points === Number(this.selectedReportScale)
        )?.name || '',
      options: this.currentAuditReportRatingOptions.map((option) => ({
        rating: option.rating,
        description: option.description,
        color: option.color,
      })),
    };
  }
  getAuditConfiguration() {
    return {
      scale: this.selectedFindingScale,
      scaleName:
        this.auditFindingRatingScale.find(
          (s) => s.points === Number(this.selectedFindingScale)
        )?.name || '',
      options: this.currentAuditFindingRatingOptions.map((option) => ({
        rating: option.rating,
        description: option.description,
        color: option.color,
      })),
    };
  }

  // Method to submit to API
  submitConfiguration() {
    const reportConfig = this.getRatingConfiguration();
    const auditConfig = this.getAuditConfiguration();
    console.log('Submitting configuration:', reportConfig, auditConfig);

    // Example API call structure
    // this.http.post('/api/audit-rating-config', config).subscribe(
    //   response => console.log('Success:', response),
    //   error => console.error('Error:', error)
    // );

    return { reportConfig, auditConfig };
  }
}

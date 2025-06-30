import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss'],
})
export class SubscriptionPlansComponent {
  subscriptionForm!: FormGroup;
  @Input() SubscriptionDetails: any | null = null;

  subscriptionPlans = [
    {
      id: 1,
      name: 'Basic Plan',
      price: 100,
      users: 10,
      icon: 'assets/images/utils/basic.svg',
    },
    {
      id: 2,
      name: 'Business Plan',
      price: 200,
      users: 20,
      icon: 'assets/images/utils/business.svg',
    },
    {
      id: 3,
      name: 'Business Plus Plan',
      price: 400,
      users: 30,
      icon: 'assets/images/utils/business-plus.svg',
    },
  ];

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.populateForm();
  }

  selectedPlan: number = 1;

  populateForm() {
    this.subscriptionForm = this.fb.group({
      selectedPlan: [
        this.SubscriptionDetails?.selectedPlan ?? 1,
        Validators.required,
      ],
      autoRenew: [this.SubscriptionDetails?.autoRenew ?? true],
      cardName: [
        this.SubscriptionDetails?.cardName || '',
        [Validators.required, Validators.minLength(3)],
      ],
      cardNumber: [
        this.SubscriptionDetails?.cardNumber || '',
        [Validators.required, Validators.pattern(/^\d{16}$/)],
      ],
      expireDate: [
        this.SubscriptionDetails?.expireDate || '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{4}$/)],
      ],
      cvv: [
        this.SubscriptionDetails?.cvv || '',
        [Validators.required, Validators.pattern(/^\d{3}$/)],
      ],
    });
  }

  handleSubmit(formValue: any) {
    console.log('Form Submitted:', formValue);
  }
}

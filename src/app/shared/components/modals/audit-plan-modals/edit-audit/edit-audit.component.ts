import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-audit',
  templateUrl: './edit-audit.component.html',
  styleUrls: ['./edit-audit.component.scss'],
})
export class EditAuditComponent {
  EditForm!: FormGroup;
  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.EditForm = this.fb.group({
      department: [''],
      auditTitle: [''],
      proposedTiming: [''],
      auditType: [''],
    });
  }

}

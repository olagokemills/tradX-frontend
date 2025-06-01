import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'],
})
export class AddUserModalComponent implements OnInit {
  addUserForm!: FormGroup;
  ngOnInit(): void {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      department: ['', Validators.required],
    });
  }
  reportPermissions = [
    { key: 'addReport', label: 'Can Add Report' },
    { key: 'favoriteFinding', label: 'Can Favorite a Finding' },
    { key: 'generateReport', label: 'Can Generate Report' },
    { key: 'viewFindings', label: 'Can View Findings' },
  ];

  userPermissions = [
    { key: 'addUsers', label: 'Can Add Users' },
    { key: 'editUsers', label: 'Can Edit Users' },
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserModalComponent>
  ) {}

  onClose() {
    this.dialogRef.close();
  }
  onSubmit(values: any) {}
}

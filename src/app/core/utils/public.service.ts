import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  constructor(
    public toastr: ToastrService,
    public fb: FormBuilder,
    public router: Router,
    public spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {}

  blockNonNumeric(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Home',
      'End',
      'Enter',
    ];

    // Allow essential keys and digits
    if (
      !allowedKeys.includes(event.key) &&
      !/^\d$/.test(event.key) &&
      !(event.metaKey || event.ctrlKey) // Allow Mac Cmd+C/V/X and Ctrl+C/V/X
    ) {
      event.preventDefault(); // Block anything else
    }
  }
}

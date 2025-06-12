import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';

//import { GenericModalComponent } from 'src/app/shared/modals/generic-modal/generic-modal.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  constructor(
    public toastr: ToastrService,
    public fb: FormBuilder,
    public router: Router,
    public spinner: NgxSpinnerService
  ) {}

  private valueSource = new BehaviorSubject<string>('1');
  currentValue$ = this.valueSource.asObservable();

  updateValue(newValue: string) {
    this.valueSource.next(newValue);
  }

  // checkExtraFields(data: OtpResponse) {
  //   if (
  //     data.AnnualTurnOver == '' ||
  //     data.employerName == '' ||
  //     !data.employerName
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }

  // BiometricInfo!: SelfieResponse;

  formatBasicDate(dateString: any): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  formatDoBDate(dateString: string): string {
    if (!dateString) return '';
    // Split the string into parts
    const [day, monthStr, yearStr] = dateString.split('-');
    // Map month short names to numbers
    const months: { [key: string]: string } = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };
    const month = months[monthStr];
    // Convert 2-digit year to 4-digit year (assume 1900s for 00-99)
    const year = Number(yearStr) > 30 ? `19${yearStr}` : `20${yearStr}`;
    return `${day.padStart(2, '0')}-${month}-${year}`;
  }

  formatNokDate(dateString: any): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  checkForEmptyValues(data: any): boolean {
    // Check if the data is an object or array
    if (Array.isArray(data)) {
      // Check each element in the array recursively
      return (
        data.length > 0 && data.every((item) => this.checkForEmptyValues(item))
      );
    } else if (typeof data === 'object' && data !== null) {
      // Check each property in the object recursively
      return Object.values(data).every(
        (value) => value !== null && this.checkForEmptyValues(value)
      );
    }
    // If data is not an object or array, return true (valid)
    return true;
  }

  fileToBase64 = (filename: any, filepath: any) => {
    return new Promise((resolve) => {
      var file = new File([filename], filepath);
      var reader = new FileReader();
      // Read file content on file loaded event
      reader.onload = function (event: any) {
        resolve(event.target.result);
      };
      // Convert data to base64
      reader.readAsDataURL(file);
    });
  };

  collectSeconds() {
    const secs = new Date().getSeconds();
    const uuid = `${Math.random().toString(36).substring(2, 12)}${secs}`;
    return uuid;
  }

  getNewDocsSrc(data: any): string {
    const fileExtension = data.documentName.split('.').pop(); // Extract file extension
    const imgSrc = `data:image/${fileExtension};base64,${data.documentBase64}`;
    return imgSrc;
  }
  takeHome() {
    setTimeout(() => {
      this.spinner.hide();
      sessionStorage.clear();
      this.router.navigate(['/home']);
    }, 1500);
  }

  // OpenModal(width?: string, name?: string) {
  //   const dialogRef = this.dialog.open(GenericModalComponent, {
  //     width: width ?? '780px',
  //     panelClass: ['overflow-y'],
  //     disableClose: true,
  //     data: {
  //       pageName: name ?? 'DataProcessing',
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res === 'reject') {
  //       this.toastr.info(
  //         'You need to accept the T&C to continue',
  //         'Taking you home...'
  //       );
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 1200);
  //     }
  //   });
  // }

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

  returnSrc(baseString: string, baseFormat: string) {
    const imgSrc = `${baseFormat};base64,${baseString}`;
    return imgSrc;
  }

  private categorySource = new BehaviorSubject<any | null>(null);
  currentCategory$ = this.categorySource.asObservable();

  private currentStepText = new BehaviorSubject<string>(
    'Please provide your reference details.'
  );
  currentStepText$ = this.currentStepText.asObservable();

  private currentStepNumber = new BehaviorSubject<number>(1);
  currentStepNumber$ = this.currentStepNumber.asObservable();

  private currentHeaderText = new BehaviorSubject<string>('Get Started');
  currentHeaderText$ = this.currentHeaderText.asObservable();

  setCurrentStepNumber(step: number) {
    this.currentStepNumber.next(step);
  }
  setCurrentHeader(title: string) {
    this.currentHeaderText.next(title);
  }
  setCurrentStepText(title: string) {
    this.currentStepText.next(title);
  }

  compareNames(
    NinData: { firstName: string; lastName: string; middlename: string },
    BvnData: { FirstName: string; LastName: string; MiddleName: string }
  ): boolean {
    const normalize = (str: string | null | undefined) =>
      (str || '').trim().toLowerCase();

    // Normalize all name parts
    const ninFirst = normalize(NinData.firstName);
    const ninLast = normalize(NinData.lastName);
    const ninMiddle = normalize(NinData.middlename);

    const bvnFirst = normalize(BvnData.FirstName);
    const bvnLast = normalize(BvnData.LastName);
    const bvnMiddle = normalize(BvnData.MiddleName);

    // Create arrays of all non-empty name parts
    const ninParts = [ninFirst, ninLast, ninMiddle].filter(
      (part) => part !== ''
    );
    const bvnParts = [bvnFirst, bvnLast, bvnMiddle].filter(
      (part) => part !== ''
    );

    let matchCount = 0;

    // Function to check for partial matches
    function isPartialMatch(name1: string, name2: string): boolean {
      if (!name1 || !name2) return false;
      const minLen = Math.min(name1.length, name2.length);
      return (
        name1.slice(0, Math.ceil(minLen / 2)) ===
        name2.slice(0, Math.ceil(minLen / 2))
      );
    }

    // Compare each NIN part against each BVN part
    for (const ninPart of ninParts) {
      for (const bvnPart of bvnParts) {
        // Check for exact match
        if (ninPart === bvnPart) {
          matchCount++;
          // Remove the matched part to prevent double counting
          bvnParts.splice(bvnParts.indexOf(bvnPart), 1);
          break; // Move to next NIN part
        }
      }
    }

    // Check for partial matches if we have low match count
    if (matchCount < 1.75) {
      for (const ninPart of ninParts) {
        for (const bvnPart of bvnParts) {
          if (isPartialMatch(ninPart, bvnPart)) {
            matchCount += 0.5;
            // Remove the partially matched part to prevent double counting
            bvnParts.splice(bvnParts.indexOf(bvnPart), 1);
            break; // Move to next NIN part
          }
        }
      }
    }

    return matchCount >= 1.75;
  }
}

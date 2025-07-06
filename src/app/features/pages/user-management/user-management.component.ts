import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, debounceTime, switchMap } from 'rxjs';
import { UserService } from 'src/app/core/services/users.service';
import { AddUserModalComponent } from 'src/app/shared/components/modals/add-user-modal/add-user-modal.component';
import {
  Role,
  UserData,
  UserPayload,
} from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  dialog = inject(MatDialog);
  searchQuery: string = '';
  UsersList!: UserData[];
  searchSubject: Subject<string> = new Subject();
  OrgId: string = '';
  constructor(private api: UserService) {
    const Org = JSON.parse(sessionStorage.getItem('organizationInfo')!);
    console.log(Org, 'org here');
    this.OrgId = Org?.data.organizationCode;
    console.log(this.OrgId, 'org id here');
  }
  ngOnInit(): void {
    this.GetUsers();
    this.handleSearchInput();
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  fetchSearchResults() {
    return new Observable((observer: any) => {
      this.GetUsers();
      observer.next();
      observer.complete();
    });
  }

  handleSearchInput() {
    this.searchSubject
      .pipe(
        debounceTime(500),
        switchMap((searchTerm) => {
          this.searchQuery = searchTerm;
          return this.fetchSearchResults();
        })
      )
      .subscribe();
  }

  GetUsers() {
    this.UsersList = [];
    let observable;
    const payload: UserPayload = {
      pageNumber: 1,
      pageSize: 20,
      organizationId: this.OrgId,
      searchQuery: this.searchQuery,
    };
    observable = this.api.GetUsers(payload);
    observable.subscribe({
      next: (res: any) => {
        this.UsersList = res.data;
      },
      error: (err) => {},
    });
  }

  OpenModal(item?: any) {
    const dialogRef = this.dialog.open(AddUserModalComponent, {
      width: '500px',
      data: {
        userData: item?.body,
        action: item?.action,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.GetUsers();
    });
  }

  modifyUser(data: UserData) {
    this.OpenModal({ body: data, action: 'Toggle' });
  }
  editUser(data: UserData) {
    this.OpenModal({ body: data, action: 'Edit' });
  }
  deleteUser(data: UserData) {
    this.OpenModal({ body: data, action: 'Delete' });
  }
}

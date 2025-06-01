import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './components/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { ReusableTableComponent } from './components/reusable-table/reusable-table.component';
import { AddUserModalComponent } from './components/modals/add-user-modal/add-user-modal.component';

@NgModule({
  declarations: [TextInputComponent, ReusableTableComponent, HeaderComponent, AddUserModalComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [TextInputComponent, ReusableTableComponent, HeaderComponent],
})
export class SharedModule {}

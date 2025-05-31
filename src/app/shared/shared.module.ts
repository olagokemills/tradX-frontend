import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './components/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReusableTableComponent } from './components/reusable-table/reusable-table.component';

@NgModule({
  declarations: [TextInputComponent, ReusableTableComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [TextInputComponent, ReusableTableComponent],
})
export class SharedModule {}

import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-reusable-table',
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.scss'],
})
export class ReusableTableComponent {
  @Input() tableData: Array<any> = [];
  @Input() isLoading: boolean = false;

  // Pagination inputs
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() totalCount: number = 0;
  @Input() hasNextPage: boolean = false;
  @Input() hasPreviousPage: boolean = false;
  @Input() showPagination: boolean = true;

  // Pagination outputs
  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();

  @ContentChild('headers') headers!: TemplateRef<any>;
  @ContentChild('rows') rows!: TemplateRef<any>;

  getColumnCount(): number {
    if (this.tableData && this.tableData.length > 0) {
      return Object.keys(this.tableData[0]).length;
    }
    // Default column count when no data is available
    return 6;
  }

  shouldShowPagination(): boolean {
    return this.showPagination && (this.hasNextPage || this.hasPreviousPage || this.totalPages > 1);
  }

  onNextPage(): void {
    if (this.hasNextPage) {
      this.nextPage.emit();
    }
  }

  onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.previousPage.emit();
    }
  }
}

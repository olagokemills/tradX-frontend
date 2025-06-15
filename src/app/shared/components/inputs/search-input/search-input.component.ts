import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent {
  searchTerm = '';

  @Output() search = new EventEmitter<string>();
  @Input() placeholder: string = 'Search here with any parameter...';

  onSearch() {
    this.search.emit(this.searchTerm);
  }
  clear() {
    this.searchTerm = '';
  }
}

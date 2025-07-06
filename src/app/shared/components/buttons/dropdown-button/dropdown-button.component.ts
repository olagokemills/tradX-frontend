import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss'],
})
export class DropdownButtonComponent {
  @Input() buttonLabel = 'More options';
  @Input() items: { label: string; value: any }[] = [];

  @Output() itemClicked = new EventEmitter<any>();
  constructor() {
    console.log(this.buttonLabel);
  }
  handleSelect(value: any) {
    this.itemClicked.emit(value);
  }

  returnStrippedValue(value: any): string {
    if (!value) {
      return '';
    }
    return value.split(' ')[1];
  }
}

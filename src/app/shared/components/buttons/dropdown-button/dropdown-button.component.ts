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

  handleSelect(value: any) {
    this.itemClicked.emit(value);
  }
}

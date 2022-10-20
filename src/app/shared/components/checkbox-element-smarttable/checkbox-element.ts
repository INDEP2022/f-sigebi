import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-checkbox-element',
  template: `
    <div class="row justify-content-center">
      <input
        [checked]="checked"
        (change)="onToggle($event)"
        type="checkbox" />
    </div>
  `,
  styles: [],
})
export class CheckboxElementComponent implements OnInit {

  checked: boolean;

  @Input() value: boolean;
  @Input() rowData: any;

  @Output() toggle: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.checked = this.value;
  }

  onToggle($event: any) {
    let row = this.rowData;
    let toggle = $event;
    this.toggle.emit({ row, toggle });
  }
}

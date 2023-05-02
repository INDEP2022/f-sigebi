import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox-element',
  template: `
    <div class="row justify-content-center">
      <input
        class="form-control"
        bsDatepicker
        type="date"
        [value]="bsValue"
        (change)="onToggle($event)" />
    </div>
  `,
  styles: [],
})
export class DatePickerElementComponent<T = any> implements OnInit {
  bsValue: string;

  @Input() value: string;
  @Input() rowData: T;

  @Output() toggle: EventEmitter<{ row: T; toggle: string }> =
    new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.bsValue = this.value;
  }

  onToggle($event: Event) {
    let row = this.rowData;
    let toggle = ($event.currentTarget as HTMLInputElement).value;
    this.toggle.emit({ row, toggle });
  }
}

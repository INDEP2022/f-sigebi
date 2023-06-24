import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox-element',
  template: `
    <div class="row justify-content-center w-80 px-4">
      <input
        class="form-control"
        bsDatepicker
        [(ngModel)]="bsValue"
        (ngModelChange)="onToggle($event)" />
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

  onToggle($event: any) {
    let row = this.rowData;
    let date = new Date($event);
    let toggle =
      this.fLessTen(date.getDate()) +
      '/' +
      this.fLessTen(date.getMonth() + 1) +
      '/' +
      date.getFullYear();
    this.toggle.emit({ row, toggle });
  }

  fLessTen(value: any) {
    let elm = parseInt(value);
    return elm < 10 ? '0' + value : value;
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styles: [],
})
export class InputFieldComponent implements ViewCell, OnInit {
  @Input() value: any = null;
  @Input() rowData: any = null;
  @Output() input: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  changeInput(event: any) {
    this.input.emit({ row: this.rowData, text: this.value });
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styles: [],
})
export class InputFieldComponent implements ViewCell, OnInit {
  @Input() value: string = '';
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  inputChange() {
    this.input.emit({ row: this.rowData, data: this.value });
  }
}

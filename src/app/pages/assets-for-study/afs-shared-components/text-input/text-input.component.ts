import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styles: [],
})
export class TextInputComponent implements ViewCell, OnInit {
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() btnclick: EventEmitter<any> = new EventEmitter();
  quantity: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.renderValue = this.value.toString().toUpperCase();
  }

  getChanges(event: any) {
    let data = { quantity: this.quantity, row: this.rowData };
    this.btnclick.emit(data);
  }
}

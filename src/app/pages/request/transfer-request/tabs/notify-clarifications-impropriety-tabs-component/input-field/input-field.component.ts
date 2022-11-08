import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styles: [],
})
export class InputFieldComponent implements OnInit {
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() btnclick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onActionBtn() {
    this.btnclick.emit(this.rowData);
  }
}

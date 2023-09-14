import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-gss-input-field',
  templateUrl: './gss-input-field.component.html',
  styles: [],
})
export class GssInputFieldComponent implements OnInit {
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();
  text: string = '';

  constructor() {}

  ngOnInit(): void {}

  keyUp() {
    console.log(this.value);
    this.input.emit({ data: this.rowData, text: this.value });
  }
}

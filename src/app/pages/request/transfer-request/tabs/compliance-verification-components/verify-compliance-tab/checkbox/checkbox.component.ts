import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styles: [],
})
export class CheckboxComponent implements OnInit {
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();

  inputText: String = '';

  constructor() {}

  ngOnInit(): void {
    //console.log(this.value);
  }

  checked(event: any) {
    console.log(event);
    let text = event.target.value;
    this.input.emit(this.rowData);
  }
  /* onKeyUp(event: any) {
    let text = event.target.value;
    this.input.emit({ data: this.rowData, text: text });
  } */
}

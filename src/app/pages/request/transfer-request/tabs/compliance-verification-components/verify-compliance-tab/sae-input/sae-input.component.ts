import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-sae-input',
  templateUrl: './sae-input.component.html',
  styles: [],
})
export class SaeInputComponent implements ViewCell, OnInit {
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();

  inputText: String = '';

  constructor() {}

  ngOnInit(): void {}

  onKeyUp(event: any) {
    let text = event.target.value;
    this.input.emit(text);
  }
}

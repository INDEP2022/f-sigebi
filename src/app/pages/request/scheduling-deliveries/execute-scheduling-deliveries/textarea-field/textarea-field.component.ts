import { Component, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-textarea-field',
  templateUrl: './textarea-field.component.html',
  styles: [],
})
export class TextareaFieldComponent implements OnInit {
  @Input() value: string | number = null;
  @Input() rowData: any = null;
  input: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  keyUp() {
    //console.log(this.value)
    this.input.emit({ data: this.rowData, text: this.value });
  }
}

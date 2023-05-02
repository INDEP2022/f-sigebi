import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styles: [],
})
export class DatePickerComponent extends DefaultEditor implements OnInit {
  bsValue: Date;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.cell.newValue !== '') {
      if (this.cell.getValue() !== null) {
        let date = new Date(this.cell.getValue());
        this.bsValue = date;
      }
    }
  }

  onValueChange(value: Date): void {
    let year = value.getFullYear();
    let month = value.getMonth() + 1;
    let day = value.getDate();
    this.cell.newValue = `${year}-${month}-${day}`;
  }
}

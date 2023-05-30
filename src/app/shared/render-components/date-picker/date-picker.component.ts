import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { firstFormatDate } from '../../utils/date';

function dateIsValid(date: any) {
  return (
    Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)
  );
}

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
        const strings = (this.cell.getValue() + '').split('/');
        const date = new Date(+strings[2], +strings[1] - 1, +strings[0]);
        // debugger;
        // let date = new Date(this.cell.getValue());
        // if (dateIsValid(date)) {
        //   console.log(date);
        // } else {
        //   console.log(this.cell.getValue())
        //   const strings = (this.cell.getValue() + '').split('/');
        //   date = new Date(+strings[2], +strings[1], +strings[0]);
        // }
        this.bsValue = date;
      }
    }
  }

  onValueChange(value: Date): void {
    // let year = value.getFullYear();
    // let month = value.getMonth() + 1;
    // let day = value.getDate();
    this.cell.newValue = firstFormatDate(value);
  }
}

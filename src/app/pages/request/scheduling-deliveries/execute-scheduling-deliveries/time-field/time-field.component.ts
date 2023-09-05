import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-time-field',
  templateUrl: './time-field.component.html',
  styles: [],
})
export class TimeFieldComponent implements ViewCell, OnInit {
  @Input() value: any = null;
  @Input() rowData: any = null;
  input: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    if (this.value) {
      this.value = this.parseDateNoOffset(this.value);
    }
  }

  changeTime(event: any) {
    let time = null;
    if (event != null) {
      time = moment(event).format('YYYY/MM/DD, h:mm:ss a');
    }
    this.rowData.replacementDate = time;
    this.input.emit({ row: this.rowData, text: time });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() + dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }
}

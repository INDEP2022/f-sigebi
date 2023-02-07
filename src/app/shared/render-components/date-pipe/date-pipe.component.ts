import { Component, Input, OnInit } from '@angular/core';

@Component({
  template: ` {{ renderValue }} `,
})
export class DatePipeComponent implements OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  constructor() {}

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }
}

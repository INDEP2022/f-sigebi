import { Component } from '@angular/core';
import { DefaultFilter } from 'ng2-smart-table';

@Component({
  selector: 'app-custom-filter',
  template: `
    <input
      type="checkbox"
      [(ngModel)]="event"
      (ngModelChange)="filter.emit()" />
  `,
})
export class CustomFilterComponent extends DefaultFilter {
  event: any;
  ngOnInit() {
    this.query;
  }
}

import { Component } from '@angular/core';
import { DefaultFilter } from 'ng2-smart-table';

@Component({
  template: `
    <div class="input-group" style="margin-bottom: 0px;">
      <input
        type="text"
        class="form-control"
        bsDatepicker
        [ngModel]="query"
        [bsConfig]="{ dateInputFormat: 'MM/YYYY', minMode: 'month' }"
        (ngModelChange)="onChange($event)" />
      <span class="input-group-addon" *ngIf="this.query">
        <i class="fa fa-broom" (click)="clearDate($event)"></i>
      </span>
    </div>
  `,
})
export class CustomDateMounthFilterComponent extends DefaultFilter {
  [x: string]: any;
  onChange(event: any): void {
    this.query = event;
    this.setFilter();
  }

  clearDate(event: any) {
    event.stopPropagation();
    this.query = '';
    this.setFilter();
    this['resetFilter'].emit();
  }
}

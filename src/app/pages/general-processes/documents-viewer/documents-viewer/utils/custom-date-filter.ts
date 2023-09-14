import { Component } from '@angular/core';
import { DefaultFilter } from 'ng2-smart-table';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  template: `
    <div class="input-group" style="margin-bottom: 0px;">
      <input
        type="text"
        class="form-control"
        bsDatepicker
        [bsConfig]="bsConfig"
        [(ngModel)]="query"
        (ngModelChange)="onChange($event)" />
      <span class="input-group-addon" *ngIf="query">
        <i class="fa fa-broom" (click)="clearDate($event)"></i>
      </span>
    </div>
  `,
})
export class CustomDateFilterComponent extends DefaultFilter {
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'MM/YYYY',
    minMode: 'month',
  };

  onChange(event: any): void {
    this.query = event;
    this.setFilter();
  }

  clearDate(event: any) {
    event.stopPropagation();
    this.query = '';
    this.setFilter();
  }
}

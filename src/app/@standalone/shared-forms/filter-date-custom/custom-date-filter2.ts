import { Component, Input, OnChanges } from '@angular/core';
import { DefaultFilter } from 'ng2-smart-table';

@Component({
  template: `
    <div class="input-group" style="margin-bottom: 0px;">
      <input
        type="text"
        class="form-control"
        bsDatepicker
        [ngModel]="query"
        [bsConfig]="{ dateInputFormat: 'DD/MM/YYYY' }"
        (ngModelChange)="onChange($event)"
        placeholder=""
        style="border-radius: 5px;padding: 8px;border: 1px solid #ccc;" />
      <span class="input-group-addon" *ngIf="this.query">
        <i
          class="fa fa-trash red-icon"
          (click)="clearDate($event)"
          style="color: #9D2449"></i>
      </span>
    </div>
  `,
})
export class CustomDateFilter2Component
  extends DefaultFilter
  implements OnChanges
{
  @Input() someInput: any;
  onChange(event: any): void {
    this.query = event;
    this.setFilter();
  }
  ngOnChanges() {}
  clearDate(event: any) {
    event.stopPropagation();
    this.query = '';
    this.setFilter();
  }
}

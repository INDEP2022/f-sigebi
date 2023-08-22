import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DefaultFilter } from 'ng2-smart-table';

@Component({
  template: `
    <ng-select
      addTagText="Agregar Cuenta"
      [items]="options"
      [multiple]="true"
      [(ngModel)]="selectedItems"
      (ngModelChange)="onFilterChanged()"
      [addTag]="true">
    </ng-select>
  `,
})
export class CustomMultiSelectFilterComponent
  extends DefaultFilter
  implements OnInit, OnChanges
{
  @Input() options: any[] = [];

  selectedItems: any[] = [];
  constructor() {
    super();
  }
  ngOnInit() {}
  onFilterChanged() {
    this.query = this.selectedItems.join(',');
    this.setFilter();
  }
  ngOnChanges(changes: SimpleChanges) {}
}

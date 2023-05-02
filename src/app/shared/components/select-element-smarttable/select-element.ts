import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomersModule } from 'src/app/pages/commercialization/catalogs/customers/customers.module';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-select-element',
  template: `
    <ng-select
      [items]="data"
      [multiple]="false"
      [closeOnSelect]="true"
      [searchable]="false"
      [(ngModel)]="value"
      (change)="onToggle($event)">
    </ng-select>
  `,
  styles: [],
  imports: [SharedModule, CustomersModule],
  standalone: true,
})
export class SelectElementComponent<T = any> implements OnInit {
  @Input() data: any[];
  @Input() value: any;
  @Input() rowData: T;
  @Output() toggle: EventEmitter<{ row: T; toggle: any }> = new EventEmitter();
  @Output() values: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.values.subscribe(data => {
      this.data = data;
    });
  }

  ngOnInit(): void {}

  onToggle($event: Event) {
    let row = this.rowData;
    let toggle = $event;
    this.toggle.emit({ row, toggle });
  }
}

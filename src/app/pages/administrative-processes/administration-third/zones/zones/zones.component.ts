import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COORDINATIONSZONES_COLUMNS, ZONES_COLUMNS } from './zones-columns';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styles: [],
})
export class ZonesComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  settings1 = { ...this.settings, actions: false };
  data2: any[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: ZONES_COLUMNS,
    };
    this.settings1.columns = COORDINATIONSZONES_COLUMNS;
  }

  ngOnInit(): void {}
}

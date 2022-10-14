import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COSTKEY_COLUMNS, VALIDITYCOST_COLUMNS } from './unit-cost-columns';

@Component({
  selector: 'app-unit-cost',
  templateUrl: './unit-cost.component.html',
  styles: [],
})
export class UnitCostComponent extends BasePage implements OnInit {
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
      columns: COSTKEY_COLUMNS,
    };
    this.settings1.columns = VALIDITYCOST_COLUMNS;
  }

  ngOnInit(): void {}
}

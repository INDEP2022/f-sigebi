import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COSTKEY_COLUMNS, VALIDITYCOST_COLUMNS } from './unit-cost-columns';

@Component({
  selector: 'app-unit-cost',
  templateUrl: './unit-cost.component.html',
  styles: [
  ]
})
export class UnitCostComponent extends BasePage implements OnInit {
  settings = { ...TABLE_SETTINGS, actions: false };
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  settings1 = { ...TABLE_SETTINGS, actions: false };
  data2: any[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  constructor()
  {
    super();
    this.settings.columns = COSTKEY_COLUMNS;
    this.settings1.columns = VALIDITYCOST_COLUMNS;
  }

  ngOnInit(): void {
  }

}

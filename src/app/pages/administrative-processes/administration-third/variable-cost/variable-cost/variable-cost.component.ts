import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { VARIABLECOST_COLUMNS } from './variable-cost-columns';

@Component({
  selector: 'app-variable-cost',
  templateUrl: './variable-cost.component.html',
  styles: [],
})
export class VariableCostComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: VARIABLECOST_COLUMNS,
    };
  }
  ngOnInit(): void {}
}

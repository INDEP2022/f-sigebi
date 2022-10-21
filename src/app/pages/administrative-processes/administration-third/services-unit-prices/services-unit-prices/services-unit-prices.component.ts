import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SERVICEUNITPRECES_COLUMNS } from './service-unit-preces-columns';

@Component({
  selector: 'app-services-unit-prices',
  templateUrl: './services-unit-prices.component.html',
  styles: [],
})
export class ServicesUnitPricesComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: SERVICEUNITPRECES_COLUMNS,
    };
  }

  ngOnInit(): void {}
}

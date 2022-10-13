import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SALEGOODSPAYMENTS_COLUMNS } from './sale-goods-payments-columns';

@Component({
  selector: 'app-sale-goods-payments',
  templateUrl: './sale-goods-payments.component.html',
  styles: [],
})
export class SaleGoodsPaymentsComponent extends BasePage implements OnInit {
  settings = { ...TABLE_SETTINGS, actions: false };
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor() {
    super();
    this.settings.columns = SALEGOODSPAYMENTS_COLUMNS;
  }

  ngOnInit(): void {}
}

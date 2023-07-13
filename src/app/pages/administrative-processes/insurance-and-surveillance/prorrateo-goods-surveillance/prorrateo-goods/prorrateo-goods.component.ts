import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { PRORRATEGO_GOODS_COLUMNS } from './prorrateo-goods-columns';

@Component({
  selector: 'app-prorrateo-goods',
  templateUrl: './prorrateo-goods.component.html',
  styles: [],
})
export class ProrrateoGoodsComponent extends BasePage implements OnInit {
  goods: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: PRORRATEGO_GOODS_COLUMNS,
    };
  }

  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SELECT_GOODS_REQUEST_COLUMNS } from '../../documents.columns';
import { goodsRequestData } from '../../documents.data';

@Component({
  selector: 'app-goods-selected-form',
  templateUrl: './goods-selected-form.component.html',
  styles: [],
})
export class GoodsSelectedFormComponent extends BasePage implements OnInit {
  selectsGoods = goodsRequestData;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor() {
    super();

    this.settings = {
      ...this.settings,
      actions: { columnTitle: 'Expediente', delete: false },
      edit: {
        editButtonContent: 'Ver expediente',
      },
      columns: SELECT_GOODS_REQUEST_COLUMNS,
    };
  }

  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  AVAILABLE_GOODS_EVENTO_COLUMNS,
  AVAILABLE_GOODS_LOTE_COLUMNS,
} from './available-goods-columns';

@Component({
  selector: 'app-available-goods-table',
  templateUrl: './available-goods-table.component.html',
  styles: [],
})
export class AvailableGoodsTableComponent extends BasePage implements OnInit {
  settings2 = {
    ...this.settings,
    actions: false,
  };
  settings3 = {
    ...this.settings,
    actions: false,
  };

  data: any;
  data2: any;
  data3: any;
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...AVAILABLE_GOODS_EVENTO_COLUMNS },
    };
    this.settings2.columns = AVAILABLE_GOODS_LOTE_COLUMNS;
    this.settings3.columns = AVAILABLE_GOODS_EVENTO_COLUMNS;
  }

  ngOnInit(): void {}
}

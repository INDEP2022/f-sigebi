import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { REJECTED_GOODS_COLUMNS } from './rejected-goods-columns';

@Component({
  selector: 'app-rejected-goods-table',
  templateUrl: './rejected-goods-table.component.html',
  styles: [],
})
export class RejectedGoodsTableComponent extends BasePage implements OnInit {
  data: any;
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...REJECTED_GOODS_COLUMNS },
    };
  }

  ngOnInit(): void {}
}

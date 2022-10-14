import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SALEGOODSPARTICIPANTS_COLUMNS } from './sale-goods-participants-columns';

@Component({
  selector: 'app-sale-goods-participants',
  templateUrl: './sale-goods-participants.component.html',
  styles: [],
})
export class SaleGoodsParticipantsComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...SALEGOODSPARTICIPANTS_COLUMNS },
    };
  }

  ngOnInit(): void {}
}

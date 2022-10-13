import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SALEGOODSPARTICIPANTS_COLUMNS } from './sale-goods-participants-columns';

@Component({
  selector: 'app-sale-goods-participants',
  templateUrl: './sale-goods-participants.component.html',
  styles: [],
})
export class SaleGoodsParticipantsComponent extends BasePage implements OnInit {
  settings = { ...TABLE_SETTINGS, actions: false };
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor() {
    super();
    this.settings.columns = SALEGOODSPARTICIPANTS_COLUMNS;
  }

  ngOnInit(): void {}
}

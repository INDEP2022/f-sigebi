import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SALEGOODSINCORPORATEPACKAGES_COLUMNS } from './sale-goods-games-incorporate-columns';

@Component({
  selector: 'app-sale-goods-games-incorporate-packages',
  templateUrl: './sale-goods-games-incorporate-packages.component.html',
  styles: [],
})
export class SaleGoodsGamesIncorporatePackagesComponent
  extends BasePage
  implements OnInit
{
  settings = { ...TABLE_SETTINGS, actions: false };
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings.columns = SALEGOODSINCORPORATEPACKAGES_COLUMNS;
  }

  ngOnInit(): void {}
  close() {
    this.modalRef.hide();
  }
}

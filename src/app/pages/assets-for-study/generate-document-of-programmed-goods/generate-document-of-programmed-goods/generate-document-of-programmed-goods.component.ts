import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  ASSETS_LIST_COLUMNS,
  DELIVERED_GOODS,
  NOT_ACCEPTED_GOODS,
} from './columns';

@Component({
  selector: 'app-generate-document-of-programmed-goods',
  templateUrl: './generate-document-of-programmed-goods.component.html',
  styles: [],
})
export class GenerateDocumentOfProgrammedGoodsComponent
  extends BasePage
  implements OnInit
{
  dataAssets: any;
  save: boolean = false;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  settings1 = { ...this.settings, actions: false };
  data2: any[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;

  settings2 = { ...this.settings, actions: false };
  data3: any[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;

  examplesListAssets: any;
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: ASSETS_LIST_COLUMNS,
    };
    this.settings1.columns = DELIVERED_GOODS;
    this.settings2.columns = NOT_ACCEPTED_GOODS;
  }

  ngOnInit(): void {}

  getListAssetsData(event: any) {
    console.log('lista de bienes');
    this.examplesListAssets = event;
  }

  //TODO: Notificacion de cambio de subinventario
  sendNotificationOfChange() {}

  //TODO: Cambio de bienes de subinventario
  ChangeOfSubinventary() {}
}

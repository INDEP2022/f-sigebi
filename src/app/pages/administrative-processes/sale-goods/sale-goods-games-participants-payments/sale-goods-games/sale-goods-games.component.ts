import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SaleGoodsGamesEstateComponent } from '../sale-goods-games-estate/sale-goods-games-estate.component';
import { SaleGoodsGamesIncorporatePackagesComponent } from '../sale-goods-games-incorporate-packages/sale-goods-games-incorporate-packages.component';
import {
  ALIENATIONSALEGOODSGAMES_COLUMNS,
  ESTATESALEGOODSGAMES_COLUMNS,
} from './sale-goods-games-columns';

@Component({
  selector: 'app-sale-goods-games',
  templateUrl: './sale-goods-games.component.html',
  styles: [],
})
export class SaleGoodsGamesComponent extends BasePage implements OnInit {
  settings2 = { ...this.settings, actions: false };

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...ALIENATIONSALEGOODSGAMES_COLUMNS },
    };
    this.settings2.columns = ESTATESALEGOODSGAMES_COLUMNS;
  }

  ngOnInit(): void {}
  openIncorporatePackages(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SaleGoodsGamesIncorporatePackagesComponent, config);
  }
  openEstate(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SaleGoodsGamesEstateComponent, config);
  }
}

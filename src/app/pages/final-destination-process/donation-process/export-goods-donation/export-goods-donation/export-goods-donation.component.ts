import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_EXPORT_GOODS } from './columns-export-goods';

@Component({
  selector: 'app-export-goods-donation',
  templateUrl: './export-goods-donation.component.html',
  styles: [],
})
export class ExportGoodsDonationComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data = EXAMPLE_DATA;
  constructor() {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS_EXPORT_GOODS;
  }

  ngOnInit(): void {}

  settingsChange($event: any): void {
    this.settings = $event;
  }
}

const EXAMPLE_DATA = [
  {
    numberGood: 123,
    description: 'PRUEBA',
    quantity: 1,
    clasificationNumb: 1,
    tansfNumb: 1,
    delAdmin: 1,
    delDeliv: 1,
    recepDate: '01/01/2022',
    status: 1,
    proceedingsNumb: 1,
    cpd: false,
    adm: false,
    RDA: false,
  },
];

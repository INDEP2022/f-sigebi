import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { AREA_COLUMNS } from './area-columns';
import { ERROR_COLUMNS } from './error-columns';

@Component({
  selector: 'app-modal-approval-donation',
  templateUrl: './modal-approval-donation.component.html',
  styles: [],
})
export class ModalApprovalDonationComponent extends BasePage implements OnInit {
  title: string;
  subTitle: string;
  op: string;
  data: any;
  constructor() {
    super();
    this.settings = { ...this.settings, actions: false };
  }

  ngOnInit(): void {
    if (this.op == 'select-area') {
      this.settings.columns = AREA_COLUMNS;
      this.data = EXAMPLE_DATA1;
    } else {
      if (this.op === 'see-error') {
        this.settings.columns = ERROR_COLUMNS;
        this.data = EXAMPLE_DATA2;
      }
    }
  }
}

const EXAMPLE_DATA1 = [
  {
    id: 1,
    description: 'REGIONAL TIJUANA',
  },
  {
    id: 2,
    description: 'REGIONAL HERMOSILLO',
  },
];

const EXAMPLE_DATA2 = [
  {
    goodsNumb: 454587,
    goodsDescrip: 'NO CUENTA CON UN ALMACÉN',
  },
  {
    goodsNumb: 121454,
    goodsDescrip: 'NO CUENTA CON UN ALMACÉN',
  },
];

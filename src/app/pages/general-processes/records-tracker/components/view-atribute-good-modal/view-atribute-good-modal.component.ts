import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IGood } from 'src/app/core/models/ms-good/good';
import { BasePage } from 'src/app/core/shared';
import { ATRIBUT_ACT_COLUMNS } from './columns';
import { ChangeOfGoodCharacteristicService } from './services/change-of-good-classification.service';

@Component({
  selector: 'app-view-atribute-good-modal',
  templateUrl: './view-atribute-good-modal.component.html',
  styles: [],
})
export class ViewAtributeGoodModalComponent extends BasePage implements OnInit {
  good: IGood;
  classificationOfGoods: number;
  atributActSettings: any;
  goodChange: number = 0;
  service = inject(ChangeOfGoodCharacteristicService);
  constructor(private modalRef: BsModalRef) {
    super();
    this.atributActSettings = {
      ...this.settings,
      actions: null,
      hideSubHeader: false,
      columns: { ...ATRIBUT_ACT_COLUMNS },
    };
  }

  ngOnInit(): void {
    console.log(this.classificationOfGoods);

    setTimeout(() => {
      this.goodChange++;
    }, 100);
  }

  close() {
    this.modalRef.hide();
  }
}

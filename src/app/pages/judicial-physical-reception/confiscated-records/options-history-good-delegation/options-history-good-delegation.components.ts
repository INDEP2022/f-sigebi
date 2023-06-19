import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-options-history-good-delegation',
  templateUrl: './option-history-good-delegation.component.html',
  styleUrls: [],
})
export class OptionsHistoryGoodDelegation extends BasePage implements OnInit {
  idGood: number;
  numberExpedient: string;

  constructor(private router: Router, private bsModel: BsModalRef) {
    super();
  }

  ngOnInit(): void {}

  goToDelegation() {
    this.alert('info', 'Función en desarrollo', '');
  }

  goToHistorico() {
    localStorage.setItem('numberExpedient', this.numberExpedient);

    this.router.navigate(
      ['/pages/general-processes/historical-good-situation'],
      { queryParams: { noBien: this.idGood } }
    );

    this.bsModel.hide();
  }

  close() {
    this.bsModel.hide();
  }
}

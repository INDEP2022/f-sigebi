import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-order-w-o-billing',
  templateUrl: './order-w-o-billing.component.html',
  styles: [],
})
export class OrderWOBillingComponent extends BasePage implements OnInit {
  data: any[] = [
    {
      username: 'Tania Beatriz Farfan',
      email: 'farfan@indep.gob.mx',
      mandato: 'mandato1',
      to: false,
      withCopy: true,
      sendMail: false,
    },
  ];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings.actions.edit = false;
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-pa-pdm-owob-c-order-w-o-billing',
  templateUrl: './pa-pdm-owob-c-order-w-o-billing.component.html',
  styles: [],
})
export class PaPdmOwobCOrderWOBillingComponent
  extends BasePage
  implements OnInit
{
  settings = { ...TABLE_SETTINGS };
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

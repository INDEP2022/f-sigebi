import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-audience-sirsae-payments',
  templateUrl: './audience-sirsae-payments.component.html',
  styles: [],
})
export class AudienceSirsaePaymentsComponent
  extends BasePage
  implements OnInit
{
  data: any[] = [
    {
      user: 'TFARFAN',
      username: 'Tania Beatriz Farfan',
      distributionMail: true,
      noSendMail: false,
      batchEnable: true,
    },
    {
      user: 'TFARFAN',
      username: 'Tania Beatriz Farfan',
      distributionMail: true,
      noSendMail: false,
      batchEnable: true,
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

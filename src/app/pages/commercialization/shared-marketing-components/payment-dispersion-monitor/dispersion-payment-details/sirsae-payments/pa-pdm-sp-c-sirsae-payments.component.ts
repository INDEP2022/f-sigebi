import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS1,COLUMNS2 } from './columns';

@Component({
  selector: 'app-pa-pdm-sp-c-sirsae-payments',
  templateUrl: './pa-pdm-sp-c-sirsae-payments.component.html',
  styles: [
  ]
})
export class PaPdmSpCSirsaePaymentsComponent extends BasePage implements OnInit {

  settings = {...TABLE_SETTINGS};
  data:any[]=[];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  settings2 = {...TABLE_SETTINGS};
  data2:any[]=[];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings.columns = COLUMNS1;
    this.settings.actions.delete = false;
    this.settings.actions.add = false
    this.settings.actions.edit = false

    this.settings2.columns = COLUMNS2;
    this.settings2.actions.delete = false;
    this.settings2.actions.add = false
    this.settings2.actions.edit = false

  }

  ngOnInit(): void {
  }

  close() {
    this.modalRef.hide();
  }

  settingsChange($event:any): void {
    this.settings=$event;
  }

  settingsChange2($event:any): void {
    this.settings2=$event;
  }

}

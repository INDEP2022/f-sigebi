import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS1, COLUMNS2 } from './columns';

@Component({
  selector: 'app-sirsae-payments',
  templateUrl: './sirsae-payments.component.html',
  styles: [],
})
export class SirsaePaymentsComponent extends BasePage implements OnInit {
  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  settings2 = { ...this.settings };
  data2: any[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS1 },
    };
    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS2 },
    };
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }
}

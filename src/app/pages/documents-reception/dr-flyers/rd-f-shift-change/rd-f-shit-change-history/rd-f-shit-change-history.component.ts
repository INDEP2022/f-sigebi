import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { SHIFT_CHANGE_HISTORY_COLUMNS } from './shift-change-history-columns';

@Component({
  selector: 'app-rd-f-shit-change-history',
  templateUrl: './rd-f-shit-change-history.component.html',
  styles: [
    `
      .mb {
        padding-top: 0 !important;
      }
    `,
  ],
})
export class RdFShitChangeHistoryComponent implements OnInit {
  

  constructor(private modalRef: BsModalRef) {
    this.settings.columns = SHIFT_CHANGE_HISTORY_COLUMNS;
  }

  close() {
    this.modalRef.hide();
  }
  ngOnInit(): void {}
}

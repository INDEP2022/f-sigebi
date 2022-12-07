import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

import { SHIFT_CHANGE_HISTORY_COLUMNS } from './shift-change-history-columns';

@Component({
  selector: 'app-shift-change-history',
  templateUrl: './shift-change-history.component.html',
  styles: [
    `
      .mb {
        padding-top: 0 !important;
      }
    `,
  ],
})
export class ShiftChangeHistoryComponent extends BasePage implements OnInit {
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings.columns = SHIFT_CHANGE_HISTORY_COLUMNS;
  }

  close() {
    this.modalRef.hide();
  }
  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { HistoryOfficialService } from 'src/app/core/services/ms-historyofficial/historyOfficial.service';
import { BasePage } from 'src/app/core/shared/base-page';

import { IHistoryOfficial } from '../../../../../core/models/ms-historyofficial/historyofficial.model';
import { SHIFT_CHANGE_HISTORY_COLUMNS } from './shift-change-history-columns';

@Component({
  selector: 'app-shift-change-history',
  templateUrl: './shift-change-history.component.html',
  styles: [
    `
      .mb {
        padding-top: 0 !important;
      }
      ng-scrollbar {
        ::ng-deep {
          .ng-scroll-viewport {
            padding-right: 1em !important;
            padding-bottom: 1em !important;
          }
        }
      }
    `,
  ],
})
export class ShiftChangeHistoryComponent extends BasePage implements OnInit {
  flyerNumber: number;
  historyColumns: IHistoryOfficial[] = [];
  historySettings = { ...this.settings };
  constructor(
    private modalRef: BsModalRef,
    private historyOfficeService: HistoryOfficialService
  ) {
    super();
    this.historySettings.columns = { ...SHIFT_CHANGE_HISTORY_COLUMNS };
    this.historySettings.actions = false;
  }

  ngOnInit(): void {
    this.getData();
  }

  close() {
    this.modalRef.hide();
  }

  getData() {
    if (this.flyerNumber != undefined || this.flyerNumber != null) {
      this.loading = true;
      const param = new FilterParams();
      param.addFilter('flyerNumber', this.flyerNumber);
      this.historyOfficeService.getAll(param.getParams()).subscribe({
        next: data => {
          if (data.count > 0) {
            this.historyColumns = data.data;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }
}

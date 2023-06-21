import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { HistoryIndicatorService } from 'src/app/core/services/ms-history-indicator/history-indicator.service';
import { HistoricalProcedureManagementService } from 'src/app/core/services/ms-procedure-management/historical-procedure-management.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { WorkMailboxService } from '../../work-mailbox.service';

@Component({
  selector: 'app-mailbox-modal-table',
  templateUrl: './mailbox-modal-table.component.html',
  styles: [],
})
export class MailboxModalTableComponent<T = any>
  extends BasePage
  implements OnInit
{
  $obs: (params?: _Params, body?: any) => Observable<IListResponse<any>>;
  service:
    | HistoricalProcedureManagementService
    | HistoryIndicatorService
    | WorkMailboxService
    | DocumentsService;
  title: string = '';
  rows: any[] = [];
  totalItems = 0;
  columns: any = {};
  $params = new BehaviorSubject(new FilterParams());
  body: any = {};
  showConfirmButton: boolean = false;
  selectedRow: T = null;
  proceedingsNumber: any;
  @Output() selected = new EventEmitter<T>();
  constructor(
    private modalRef: BsModalRef,
    private goodFinderService: GoodFinderService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
  }

  ngOnInit(): void {
    this.settings = { ...this.settings, columns: this.columns };

    this.getData();
  }

  getData() {
    const params = new FilterParams();
    params.addFilter('fileNumber', this.proceedingsNumber);
    this.loading = true;
    this.goodFinderService.goodFinder(params.getParams()).subscribe({
      next: resp => {
        this.loading = false;
        this.rows = resp.data;
        console.log(this.rows);
        this.totalItems = resp.count;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast(
          'warning',
          'Atención',
          'La información solicitada aún no esta disponible'
        );
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.selected.emit(this.selectedRow);
    this.modalRef.hide();
  }
}

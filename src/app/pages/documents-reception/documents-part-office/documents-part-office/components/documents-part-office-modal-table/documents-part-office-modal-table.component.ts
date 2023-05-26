import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  Observable,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { HistoryIndicatorService } from 'src/app/core/services/ms-history-indicator/history-indicator.service';
import { HistoricalProcedureManagementService } from 'src/app/core/services/ms-procedure-management/historical-procedure-management.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocumentsPartOfficeService } from '../../../documents-part-office.service';

@Component({
  selector: 'app-documents-part-office-modal-table',
  templateUrl: './documents-part-office-modal-table.component.html',
  styles: [],
})
export class DocumentsPartOfficeModalTableComponent<T = any>
  extends BasePage
  implements OnInit
{
  $obs: (params?: _Params, body?: any) => Observable<IListResponse<any>>;
  service:
    | HistoricalProcedureManagementService
    | HistoryIndicatorService
    | DocumentsPartOfficeService
    | DocumentsService;
  title: string = '';
  rows: any[] = [];
  totalItems = 0;
  columns: any = {};
  $params = new BehaviorSubject(new FilterParams());
  body: any = {};
  showConfirmButton: boolean = false;
  selectedRow: T = null;
  @Output() selected = new EventEmitter<T>();
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = { ...this.settings, actions: false };
  }

  ngOnInit(): void {
    this.settings = { ...this.settings, columns: this.columns };
    this.$params
      .pipe(
        takeUntil(this.$unSubscribe),
        switchMap(params => this.getData(params))
      )
      .subscribe();
  }

  getData(params: FilterParams) {
    this.hideError();
    this.loading = true;
    const obs = this.$obs.call(this.service, params.getParams(), this.body);
    return obs.pipe(
      catchError(error => {
        this.loading = false;
        if (error.status >= 500) {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al obtener los datos'
          );
        }
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        this.rows = response.data;
        console.log(this.rows);
        this.totalItems = response.count;
      })
    );
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.selected.emit(this.selectedRow);
    this.modalRef.hide();
  }
}

import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IAppraisersGood } from 'src/app/core/models/good/good.model';
import { AppraisalGoodService } from 'src/app/core/services/ms-appraisal-good/appraisal-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
@Component({
  selector: 'app-appraisal-history',
  templateUrl: './appraisal-history.component.html',
  styles: [],
})
export class AppraisalHistoryComponent extends BasePage implements OnInit {
  /* loading: boolean = false; */
  parentModal: string;
  idGood: number | string;
  appraisalData: IAppraisersGood[];
  newAppraisalData: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      noRequest: {
        title: 'No. Solicitud',
        type: 'number',
        sort: false,
      },
      'requestXAppraisal.noExpert': {
        title: 'Perito',
        type: 'string',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.requestXAppraisal && row.requestXAppraisal.noExpert) {
            return row.requestXAppraisal.noExpert;
          }
          return '';
        },
      },
      'requestXAppraisal.noAppraiser': {
        title: 'Valuador',
        type: 'string',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.requestXAppraisal && row.requestXAppraisal.noAppraiser) {
            return row.requestXAppraisal.noAppraiser;
          }
          return '';
        },
      },
      appraisalDate: {
        title: 'Fecha Avalúo',
        type: 'date',
        sort: false,
        valuePrepareFunction: (date: any) => {
          if (date) {
            return new DatePipe('en-US').transform(date, 'dd-MM-yyyy');
          }
          return '';
        },
      },
      effectiveDate: {
        title: 'Fecha Vigencia',
        type: 'date',
        sort: false,
        valuePrepareFunction: (date: any) => {
          if (date) {
            return new DatePipe('en-US').transform(date, 'dd-MM-yyyy');
          }
          return '';
        },
      },
      valueAppraisal: {
        title: 'Importe Avalúo',
        type: 'number',
        sort: false,
      },
      'requestXAppraisal.cveCurrencyCost': {
        title: 'Moneda',
        type: 'string',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          console.log(' equestXAppraisal ', row.cveCurrencyAppraisal);
          if (
            row.requestXAppraisal &&
            row.requestXAppraisal.cveCurrencyAppraisal
          ) {
            return row.requestXAppraisal.cveCurrencyAppraisal;
          }
          return '';
        },
      },
      'good.originSignals': {
        title: 'Origen',
        type: 'string',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.good && row.good.originSignals) {
            return row.good.originSignals;
          }
          return '';
        },
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private serviceAppraiser: AppraisalGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.appraisalData);
    /* this.newAppraisalData.load(this.appraisalData); */
    this.getData();
    this.params.subscribe(res => {
      this.getData();
    });
  }

  close() {
    this.modalRef.hide();
  }

  getData() {
    this.loading = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('noGood', this.idGood);
    paramsF['sortBy'] = 'noRequest:DESC';
    paramsF.limit = this.params.getValue().limit;
    paramsF.page = this.params.getValue().page;
    this.serviceAppraiser.getAppraisalGood(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.newAppraisalData.load(res.data);
        this.totalItems = res.count || 0;
        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    );
  }
}

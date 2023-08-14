import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS_DETALLE, COLUMNS_PAGOS } from './columns';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-can-pagos-cab',
  templateUrl: './can-pagos-cab.component.html',
  styleUrls: [],
})
export class CanPagosCabComponent extends BasePage implements OnInit {
  data = new LocalDataSource();
  dataDetail = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  paramsDetail = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsDetail: number = 0;

  loading2: boolean = false;

  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: COLUMNS_PAGOS,
  };

  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: COLUMNS_DETALLE,
  };

  idEvent: any = null

  constructor(
    private comerInvoiceService: ComerInvoiceService,
    private comerDetailsService: ComerDetailsService,
    private bsModal: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.getComers();

    this.params.value.page = 1;
    this.params.value.limit = 10;

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      this.getComers();
    });
  }

  getComers() {
    this.loading = true;

    const paramsF = new FilterParams();
    this.idEvent != null ? paramsF.addFilter('idEvent', this.idEvent) : '';
    paramsF.page = this.params.value.page;
    paramsF.limit = this.params.value.limit;
    this.comerInvoiceService.getValidPayments(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.data.load(res.data);
        this.totalItems = res.count;
        this.loading = false;
      },
      err => {
        this.alert('error', 'Se Presentó un Error Inesperado', '');
        this.data.load([]);
        this.totalItems = 0;
        this.loading = false;
      }
    );
  }

  selectComer(e: any){
    console.log(e.data)
    this.getDetailPayment(e.data.idIdentifier, e.data.idEvent)
  }

  getDetailPayment(idIdentifier: string, idEvent: string) {
    this.loading2 = true;

    const paramsF = new FilterParams()
    paramsF.addFilter('id', idIdentifier)
    paramsF.addFilter('eventId', idEvent)

    this.comerDetailsService.getComerDetails(paramsF.getParams()).subscribe(
        res => {
            console.log(res)
            this.dataDetail.load(res.data)
            this.totalItemsDetail = res.count
            this.loading2 = false
        },
        err => {
            console.log(err)
            this.dataDetail.load([])
            this.totalItemsDetail = 0
            this.loading2 = false
        }
    )
  }

  close(){
    this.bsModal.hide()
  }
}

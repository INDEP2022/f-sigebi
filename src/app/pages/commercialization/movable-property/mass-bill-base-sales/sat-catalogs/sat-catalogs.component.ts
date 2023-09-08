import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SAT_CATALOGS_COLUMNS } from './sat-catalogs-columns';

@Component({
  selector: 'app-sat-catalogs',
  templateUrl: './sat-catalogs.component.html',
  styles: [],
})
export class SatCatalogsComponent extends BasePage implements OnInit {
  val: any[] = [];
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  @Input() count: number = 0;
  @Input() filter: any = null;
  @Output() countData: EventEmitter<any> = new EventEmitter();

  @Input() set data(val: any[]) {
    if (val) {
      this.setData(val);
    } else {
      this.totalItems = 0;
      this.dataFilter.load([]);
      this.dataFilter.refresh();
    }
  }

  get data() {
    return this.val;
  }

  constructor(private comerInvoice: ComerInvoiceService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...SAT_CATALOGS_COLUMNS },
    };
  }

  async setData(data: any[]) {
    let sum1: number = 0,
      sum2: number = 0,
      sum3: number = 0,
      sum4: number = 0,
      sum5: number = 0,
      sum6: number = 0;
    for (const invoice of data) {
      const data = await this.getDataInvoice(invoice);
      if (data) {
        invoice.usoComp = data.DESC_USO_COMP;
        invoice.unite = data.DESC_UNIDAD_SAT;
        invoice.prod = data.DESC_PRODSERV_SAT;
        invoice.payment = data.DESC_FORMAPAGO;
        invoice.relation = data.DESC_TIPO_RELACION_SAT;
        invoice.totaleg = data.TOTALEG;
        invoice.totaling = data.TOTALING;
        invoice.ivaeg = data.IVAEG;
        invoice.ivaing = data.IVAING;
        invoice.precioing = data.PRECIOING;
        invoice.precioeg = data.PRECIOEG;
        invoice.regional = data.REGIONAL;

        sum1 = sum1 + Number(data.TOTALEG);
        sum2 = sum2 + Number(data.TOTALING);
        sum3 = sum3 + Number(data.IVAEG);
        sum4 = sum4 + Number(data.IVAING);
        sum5 = sum5 + Number(data.PRECIOEG); //importe egresos
        sum6 = sum6 + Number(data.PRECIOING); //importe ingresos
      }
    }

    sum1 = Number(sum1.toFixed(2));
    sum2 = Number(sum2.toFixed(2));
    sum3 = Number(sum3.toFixed(2));
    sum4 = Number(sum4.toFixed(2));
    sum5 = Number(sum5.toFixed(2));
    sum6 = Number(sum6.toFixed(2));

    const values = {
      sum1,
      sum2,
      sum3,
      sum4,
      sum5,
      sum6,
    };
    this.countData.emit(values);

    this.loading = false;
    this.dataFilter.load(data);
    this.dataFilter.refresh();
  }

  async getDataInvoice(data: any) {
    const body = {
      useCompSat: data.usecompSat,
      cveUnitSat: data.unitSatKey,
      cveProdServSat: data.prodservSatKey,
      cveShapePayment: data.paymentform,
      cveTypeRelationSat: data.relationshipSatType,
      type: data.Type,
      idEventRelImg: data.eventRelimagId,
      typeVoucher: data.vouchertype,
      total: data.total,
      idEvent: data.eventId,
      idInvoice: data.billId,
      iva: data.vat,
      price: data.price,
      noDelegation: data.delegationNumber,
      dateImpression: data.impressionDate,
    };

    return firstValueFrom(
      this.comerInvoice.comerPostQuery(body).pipe(
        map(resp => resp),
        catchError(err => of(null))
      )
    );
  }

  ngOnInit(): void {
    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.count > 0) this.getAllComer();
    });
  }

  getAllComer() {
    const params = {
      ...this.filter,
      ...this.paramsList.getValue(),
      ...this.columnFilters,
      ...{ sortBy: 'batchId:ASC' },
    };

    this.loading = true;
    this.comerInvoice.getAll(params).subscribe({
      next: resp => {
        this.count = resp.count;
        this.setData(resp.data);

        // this.totalItems = resp.count;
        // this.dataFilter.load(resp.data);
        // this.dataFilter.refresh();
      },
      error: () => {
        this.loading = false;
        this.count = 0;
        this.dataFilter.load([]);
        this.dataFilter.refresh();
      },
    });
  }
}

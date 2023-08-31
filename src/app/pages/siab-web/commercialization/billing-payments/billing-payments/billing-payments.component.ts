import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { billingPaymentsModalComponent } from '../billing-payments-modal/billing-payments-modal.component';
import {
  BILLING_PAYMENTS_COLUMNS,
  BILLING_PAYMENTS_INVOICE_COLUMNS,
} from './billing-payments-colums';
import { DATA } from './data';

@Component({
  selector: 'app-billing-payments',
  templateUrl: './billing-payments.component.html',
  styles: [],
})
export class billingPaymentsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data1: LocalDataSource = new LocalDataSource();
  dataInvoice = DATA;

  data2: LocalDataSource = new LocalDataSource();
  rowSelected: boolean = false;
  rowInvoice: string = null;
  selectedRow: any = null;
  idFactura: string | number;

  columns: any[] = [];
  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  columnFilters2: any = [];

  settings2 = {
    ...this.settings,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      delete: false,
      add: false,
      position: 'right',
    },
  };

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private comerInvoiceService: ComerInvoiceService,
    private lotService: LotService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: { ...BILLING_PAYMENTS_INVOICE_COLUMNS },
    };

    this.settings2.columns = BILLING_PAYMENTS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    //this.data1.load(this.dataInvoice);

    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            console.log('Hola');
            switch (filter.field) {
              case 'id_evento':
                searchFilter = SearchFilter.EQ;
                break;
              case 'lote_publico':
                searchFilter = SearchFilter.EQ;
                break;
              case 'folio':
                searchFilter = SearchFilter.EQ;
                break;
              case 'iva':
                searchFilter = SearchFilter.EQ;
                break;
              case 'subtotal':
                searchFilter = SearchFilter.EQ;
                break;
              case 'total':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getBill();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBill());

    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id_lote':
                searchFilter = SearchFilter.EQ;
                break;
              case 'id_evento':
                searchFilter = SearchFilter.EQ;
                break;
              case 'monto':
                searchFilter = SearchFilter.EQ;
                break;
              case 'idordeningreso':
                searchFilter = SearchFilter.EQ;
                break;
              case 'fechaoi':
                searchFilter = SearchFilter.EQ;
                break;
              case 'fecha_afectacion':
                searchFilter = SearchFilter.EQ;
                break;
              case 'id_tipo_sat':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'id_pago':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
              console.log(
                (this.columnFilters2[
                  field
                ] = `${searchFilter}:${filter.search}`)
              );
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.getPayments();
        }
      });
  }

  private prepareForm() {
    this.form = this.fb.group({
      serie: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      invoice: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      event: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      allotment: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
  }

  selectRow(row: any) {
    this.rowSelected = true;
    this.idFactura = row.id_factura;
    console.log(row);
    const event = row.id_evento;
    const lot = row.id_lote;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPayments(event, lot));
    /*this.data2.load(row.invoices); //Sub
    this.data2.refresh();
    this.rowInvoice = row.event; //primary*/
  }

  openModal(context?: Partial<billingPaymentsModalComponent>) {
    const modalRef = this.modalService.show(billingPaymentsModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  /*openForm(allotment?: any) {
    this.openModal({ allotment });
  }*/

  openForm(billing?: any) {
    const modalConfig = MODAL_CONFIG;
    const factura = this.idFactura;
    modalConfig.initialState = {
      billing,
      factura,
      callback: (next: boolean) => {
        if (next)
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getBill());
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(billingPaymentsModalComponent, modalConfig);
  }

  getData() {
    this.loading = true;
    this.loading = false;
  }

  search() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBill());
  }

  getBill() {
    this.loading = true;
    /*const serie = this.form.get('serie').value;
    const invoice = this.form.get('invoice').value;
    const event = this.form.get('event').value;
    const allotment = this.form.get('allotment').value;
    let body = {
      serie: serie,
      folio: invoice,
      event_Id: event,
      lot_Id: allotment
    }*/
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.comerInvoiceService.getAllInvoicePag(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.data1.load(resp.data);
        this.data1.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        //this.alert('warning', 'No se encontraron facturas con los datos proporcionados', 'Por favor valide que los datos sean correctos');
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems = 0;
      },
    });
  }

  getPayments(idEven?: number, idLot?: number) {
    this.loading = true;
    /*let body = {
      idEvent: idEven,
      idLot: idLot,
    }*/
    if (idEven && idLot) {
      this.params2.getValue()['filter.id_evento'] = idEven;
      this.params2.getValue()['filter.lote_publico'] = idLot;
    }
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    this.lotService.getConsultPayLots(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.data2.load(resp.data);
        this.data2.refresh();
        this.totalItems2 = resp.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data2.load([]);
        this.data2.refresh();
        this.totalItems2 = 0;
      },
    });
  }
}

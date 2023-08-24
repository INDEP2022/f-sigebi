import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { CapturelineService } from 'src/app/core/services/ms-capture-line/captureline.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { GuarantyService } from 'src/app/core/services/ms-guaranty/guaranty.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  AUCTION_REPORT_COLUMNS,
  AUCTION_REPORT_COLUMNS1,
} from './auction-report-columns';

@Component({
  selector: 'app-auction-report',
  templateUrl: './auction-report.component.html',
  styles: [],
})
export class auctionReportComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  formReport: FormGroup = new FormGroup({});
  showLiquidacion = false;
  showGarantia = false;
  columns: any[] = [];
  totalItems: number = 0;
  totalItems1: number = 0;
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  columnFilters1: any = [];
  idEvent: number;
  filter: boolean = false;
  settings1 = { ...this.settings };

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  event = new DefaultSelect();
  lotPublic = new DefaultSelect();

  customer = new DefaultSelect();
  status = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private comerEventService: ComerEventService,
    private guarantyService: GuarantyService,
    private capturelineService: CapturelineService,
    private comerEventosService: ComerEventosService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: { ...AUCTION_REPORT_COLUMNS },
    };

    this.settings1 = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: { ...AUCTION_REPORT_COLUMNS1 },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareFormReport();
    this.prepareFormFilter();
    //this.getPagination();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'lote_publico':
                searchFilter = SearchFilter.EQ;
                break;
              case 'importe':
                searchFilter = SearchFilter.EQ;
                break;
              case 'id_cliente':
                searchFilter = SearchFilter.EQ;
                break;
              case 'vigencia':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDataSettlement();
        }
      });
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      lot: [null, []],
      customer: [null, []],
      status: [null, []],
      view: [null, []],
    });
  }

  private prepareFormFilter() {
    this.formReport = this.fb.group({
      nameReport: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  private prepareFormReport() {
    this.formReport = this.fb.group({
      nameReport: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.get('lot').setValue(null);
      this.getLotPublic(new ListParams(), -1);
      this.form.get('customer').setValue(null);
      this.getClient(new ListParams(), -1);
      this.form.get('status').setValue(null);
      this.getStatus(new ListParams(), -1);
      this.loading = false;
      this.data.load([]);
      this.data.refresh();
      this.totalItems = 0;
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  buildFilters() {
    this.filter = false;
  }

  filters() {
    this.filter = true;
  }

  search() {
    this.loading = false;
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
    const idEvent = this.idEvent;
    const publicLot = this.form.get('lot').value;
    const customer = this.form.get('customer').value;
    const status = this.form.get('status').value;
    const view = this.form.get('view').value;
    this.getDataSettlementFilter(idEvent, publicLot, customer, status, view);
  }

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  getEvent(params: ListParams) {
    console.log(params.text);
    if (params.text) {
      params['filter.evento'] = `$ilike:${params.text}`;
    }
    this.comerEventosService.getComerEventGet(params).subscribe({
      next: resp => {
        this.event = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.event = new DefaultSelect();
      },
    });
  }

  changeEvent(event: any) {
    console.log(event);
    if (event) {
      this.form.get('lot').setValue(null);
      this.idEvent = event.id_evento;
      this.getLotPublic(new ListParams(), event.id_evento);
      this.getClient(new ListParams(), event.id_evento);
      this.getStatus(new ListParams(), event.id_evento);
    }
  }

  getLotPublic(params: ListParams, idEvent?: number | string) {
    let body = {
      eventIn: idEvent,
      conditionIn: 4,
    };
    this.capturelineService.getSettlementReportBody(body, params).subscribe({
      next: resp => {
        console.log(resp);
        this.lotPublic = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.lotPublic = new DefaultSelect();
      },
    });
  }
  changeLot(event: any) {
    console.log(event);
    /*this.form.get('customer').setValue(event.comerClient.idClient);
    this.getClient(new ListParams(), event.idlcg);
    this.getStatus(new ListParams(), event.idlcg);*/
  }

  getClient(params: ListParams, idEvent?: number | string) {
    let body = {
      eventIn: idEvent,
      conditionIn: 6,
    };
    this.capturelineService.getSettlementReportBody(body, params).subscribe({
      next: resp => {
        console.log(resp);
        this.customer = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.customer = new DefaultSelect();
      },
    });
  }
  changeClient(event: any) {
    console.log(event);
  }

  getStatus(params: ListParams, idEvent?: number | string) {
    let body = {
      eventIn: idEvent,
      conditionIn: 5,
    };
    this.capturelineService.getSettlementReportBody(body, params).subscribe({
      next: resp => {
        console.log(resp);
        this.status = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.status = new DefaultSelect();
      },
    });
  }
  changeStatus(event: any) {
    console.log(event);
  }

  settlement() {
    //this.showGarantia = true;
    //this.filter = true;
    this.showLiquidacion = true;

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataSettlement());
  }

  warranty() {
    this.showGarantia = true;
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'lote_publico':
                searchFilter = SearchFilter.EQ;
                break;
              case 'importe':
                searchFilter = SearchFilter.EQ;
                break;
              case 'id_cliente':
                searchFilter = SearchFilter.EQ;
                break;
              case 'vigencia':
                searchFilter = SearchFilter.EQ;
                break;
              case 'desc_vista':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params1 = this.pageFilter(this.params1);
          this.getDataWarranty(this.idEvent);
        }
      });
    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataWarranty(this.idEvent));
  }

  getDataSettlement() {
    this.loading = false;
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.capturelineService.getSettlementReport(this.idEvent, param).subscribe({
      next: resp => {
        console.log(resp);
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        //console.log(this.totalItems2, resp);
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  getDataWarranty(idEvent?: number | string) {
    this.loading = false;
    /*if (idEvent) {
      this.params.getValue()['filter.id_evento'] = `$eq:${idEvent}`;
    }*/
    let param = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };
    this.guarantyService.getWarrantyReport(idEvent, param).subscribe({
      next: resp => {
        console.log(resp);
        this.data1.load(resp.data);
        this.data1.refresh();
        this.totalItems1 = resp.count;
        //console.log(this.totalItems2, resp);
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems1 = 0;
      },
    });
  }

  getDataSettlementFilter(
    idEvent?: number | string,
    lotPublic?: number | string,
    client?: string,
    status?: string,
    window?: string
  ) {
    if (idEvent && lotPublic && client && status && window) {
      this.params.getValue()['filter.id_evento'] = `$eq:${idEvent}`;
      this.params.getValue()['filter.lote_publico'] = `$eq:${lotPublic}`;
      this.params.getValue()['filter.cliente'] = `$ilike:${client}`;
      this.params.getValue()['filter.estatus'] = `$ilike:${status}`;
      this.params.getValue()['filter.desc_vista'] = `$ilike:${window}`;
    }
    this.loading = false;
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.capturelineService.getSettlementReport(param).subscribe({
      next: resp => {
        console.log(resp);
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        //console.log(this.totalItems2, resp);
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }
}

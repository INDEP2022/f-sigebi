import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { CapturelineService } from 'src/app/core/services/ms-capture-line/captureline.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { GuarantyService } from 'src/app/core/services/ms-guaranty/guaranty.service';
import { MsMassivecapturelineService } from 'src/app/core/services/ms-massivecaptureline/ms-massivecaptureline.service';
import { MassiveDepositaryService } from 'src/app/core/services/ms-massivedepositary/massivedepositary.service';
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
  formFilter: FormGroup = new FormGroup({});
  showLiquidacion = false;
  showGarantia = false;
  columns: any[] = [];
  totalItems: number = 0;
  totalItems1: number = 0;
  totalItems2: number = 0;
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  columnFilters1: any = [];
  columnFilters2: any = [];
  columnFilters3: any = [];
  columnFilters4: any = [];
  idEvent: number;
  filter: boolean = false;
  buttonFilter: boolean = true;
  showFilter: boolean = false;
  settings1 = { ...this.settings };
  settings2 = { ...this.settings };

  publicLotBody: number;
  customerBody: string;
  statusBody: string;
  viewBody: string;

  validateFilter: string;

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
    private comerEventosService: ComerEventosService,
    private msMassivecapturelineService: MsMassivecapturelineService,
    private massiveDepositaryService: MassiveDepositaryService
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

    this.settings2 = {
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
              console.log(this.columnFilters[field]);
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //this.getDataSettlement();
          this.getDataSettlementFilter(
            this.idEvent,
            this.publicLotBody,
            this.customerBody,
            this.statusBody,
            this.viewBody
          );
        }
      });

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

    this.data2
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
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.getDataSettlementFilter(
            this.idEvent,
            this.publicLotBody,
            this.customerBody,
            this.statusBody,
            this.viewBody
          );
        }
      });
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
    });
    setTimeout(() => {
      this.getEvent(new ListParams());
    }, 1000);
  }

  private prepareFormFilter() {
    this.formFilter = this.fb.group({
      lot: [null, [Validators.required]],
      customer: [null, [Validators.required]],
      status: [null, [Validators.required]],
      view: [null, [Validators.required]],
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
    if (this.formFilter.valid) {
      this.formFilter.get('lot').setValue(null);
      this.getLotPublic(new ListParams(), -1);
      this.formFilter.get('customer').setValue(null);
      this.getClient(new ListParams(), -1);
      this.formFilter.get('status').setValue(null);
      this.getStatus(new ListParams(), -1);
      this.formFilter.get('view').setValue(null);
      if (this.validateFilter == 'settlement') {
        setTimeout(() => {
          this.getLotPublic(new ListParams(), this.idEvent, 4);
          this.getStatus(new ListParams(), this.idEvent, 5);
          this.getClient(new ListParams(), this.idEvent, 6);
        }, 1000);
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.formFilter.reset();
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getDataSettlement());
        this.showLiquidacion = true;
        this.showFilter = false;
      } else {
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems1 = 0;

        setTimeout(() => {
          this.getLotPublic(new ListParams(), this.idEvent, 1);
          this.getStatus(new ListParams(), this.idEvent, 2);
          this.getClient(new ListParams(), this.idEvent, 3);
        }, 1000);

        this.params1
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getDataWarranty(this.idEvent));
        this.showGarantia = true;
        this.showFilter = false;
      }
    }
  }

  buildFilters() {
    this.filter = false;
  }

  filters() {
    this.filter = true;
  }

  search() {
    if (this.validateFilter == 'settlement') {
      this.loading = false;
      this.data.load([]);
      this.data.refresh();
      this.totalItems = 0;
      this.showLiquidacion = false;
      this.showFilter = true;
      this.publicLotBody = this.formFilter.get('lot').value;
      this.customerBody = this.formFilter.get('customer').value;
      this.statusBody = this.formFilter.get('status').value;
      this.viewBody = this.formFilter.get('view').value;
      console.log(
        this.idEvent,
        this.publicLotBody,
        this.customerBody,
        this.statusBody,
        this.viewBody
      );
      this.getDataSettlementFilter(
        this.idEvent,
        this.publicLotBody,
        this.customerBody,
        this.statusBody,
        this.viewBody
      );
    } else {
      this.loading = false;
      this.data1.load([]);
      this.data1.refresh();
      this.totalItems1 = 0;
      this.showGarantia = false;
      this.showFilter = true;
      this.publicLotBody = this.formFilter.get('lot').value;
      this.customerBody = this.formFilter.get('customer').value;
      this.statusBody = this.formFilter.get('status').value;
      this.viewBody = this.formFilter.get('view').value;
      console.log(
        this.idEvent,
        this.publicLotBody,
        this.customerBody,
        this.statusBody,
        this.viewBody
      );
      this.getDataSettlementFilter(
        this.idEvent,
        this.publicLotBody,
        this.customerBody,
        this.statusBody,
        this.viewBody
      );
    }
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
      this.formFilter.get('lot').setValue(null);
      this.idEvent = event.id_evento;
      this.getLotPublic(new ListParams(), event.id_evento);
      this.getClient(new ListParams(), event.id_evento);
      this.getStatus(new ListParams(), event.id_evento);
    }
  }

  getLotPublic(
    params: ListParams,
    idEvent?: number | string,
    condition?: number
  ) {
    let body = {
      eventIn: idEvent,
      //conditionIn: 4,
      conditionIn: condition,
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
  }

  getClient(params: ListParams, idEvent?: number | string, condition?: number) {
    let body = {
      eventIn: idEvent,
      //conditionIn: 6,
      conditionIn: condition,
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

  getStatus(params: ListParams, idEvent?: number | string, condition?: number) {
    let body = {
      eventIn: idEvent,
      conditionIn: condition,
      //conditionIn: 5,
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
    this.validateFilter = 'settlement';
    this.showLiquidacion = true;
    this.showGarantia = false;
    this.filter = true;
    this.data2.load([]);
    this.data2.refresh();
    this.totalItems2 = 0;
    this.showFilter = false;
    this.formReport.get('nameReport').setValue('');

    this.formFilter.get('lot').setValue(null);
    this.getLotPublic(new ListParams(), -1);
    this.formFilter.get('customer').setValue(null);
    this.getClient(new ListParams(), -1);
    this.formFilter.get('status').setValue(null);
    this.getStatus(new ListParams(), -1);
    this.formFilter.get('view').setValue(null);

    setTimeout(() => {
      this.getLotPublic(new ListParams(), this.idEvent, 4);
      this.getStatus(new ListParams(), this.idEvent, 5);
      this.getClient(new ListParams(), this.idEvent, 6);
    }, 1000);

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataSettlement());
  }

  filterSettlement() {}

  warranty() {
    this.validateFilter = 'warranty';
    this.showGarantia = true;
    this.showLiquidacion = false;
    this.filter = true;
    this.formReport.get('nameReport').setValue('');

    this.data1.load([]);
    this.data1.refresh();
    this.totalItems1 = 0;

    this.formFilter.get('lot').setValue(null);
    this.getLotPublic(new ListParams(), -1);
    this.formFilter.get('customer').setValue(null);
    this.getClient(new ListParams(), -1);
    this.formFilter.get('status').setValue(null);
    this.getStatus(new ListParams(), -1);
    this.formFilter.get('view').setValue(null);

    setTimeout(() => {
      this.getLotPublic(new ListParams(), this.idEvent, 1);
      this.getStatus(new ListParams(), this.idEvent, 2);
      this.getClient(new ListParams(), this.idEvent, 3);
    }, 1000);

    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataWarranty(this.idEvent));
  }

  getDataSettlement() {
    this.loading = true;
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
      //this.params.getValue()['filter.id_evento'] = `$eq:${idEvent}`;
      this.params2.getValue()['filter.lote_publico'] = `$eq:${lotPublic}`;
      this.params2.getValue()['filter.cliente'] = `$ilike:${client}`;
      this.params2.getValue()['filter.estatus'] = `$ilike:${status}`;
      this.params2.getValue()['filter.desc_vista'] = `$ilike:${window}`;
    }
    this.loading = true;
    let param = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    console.log(param);
    this.capturelineService.getSettlementReport(idEvent, param).subscribe({
      next: resp => {
        console.log(resp);
        this.data2.load(resp.data);
        this.data2.refresh();
        this.totalItems2 = resp.count;
        //console.log(this.totalItems2, resp);
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

  openPrevPdf() {
    /*let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => { },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);*/

    if (this.validateFilter == 'settlement') {
      if (this.idEvent) {
        this.params3.getValue()['filter.id_evento'] = `$eq:${this.idEvent}`;
      }
      if (
        this.publicLotBody &&
        this.customerBody &&
        this.statusBody &&
        this.viewBody
      ) {
        //this.params.getValue()['filter.id_evento'] = `$eq:${idEvent}`;
        this.params3.getValue()[
          'filter.lote_publico'
        ] = `$eq:${this.publicLotBody}`;
        this.params3.getValue()[
          'filter.cliente'
        ] = `$ilike:${this.customerBody}`;
        this.params3.getValue()['filter.estatus'] = `$ilike:${this.statusBody}`;
        this.params3.getValue()[
          'filter.desc_vista'
        ] = `$ilike:${this.viewBody}`;
      }
      let param = {
        ...this.params3.getValue(),
        ...this.columnFilters3,
      };
      const name = this.formReport.get('nameReport').value;
      param['limit'] = '';
      this.msMassivecapturelineService.getSettlementExcel(param).subscribe({
        next: resp => {
          this.downloadDocument(`${name}`, 'excel', resp.base64File);
        },
        error: err => {
          console.log(err);
        },
      });
    } else if (this.validateFilter == 'warranty') {
      if (this.idEvent) {
        this.params3.getValue()['filter.id_evento'] = `$eq:${this.idEvent}`;
      }
      if (
        this.publicLotBody &&
        this.customerBody &&
        this.statusBody &&
        this.viewBody
      ) {
        //this.params.getValue()['filter.id_evento'] = `$eq:${idEvent}`;
        this.params3.getValue()[
          'filter.lote_publico'
        ] = `$eq:${this.publicLotBody}`;
        this.params3.getValue()[
          'filter.cliente'
        ] = `$ilike:${this.customerBody}`;
        this.params3.getValue()['filter.estatus'] = `$ilike:${this.statusBody}`;
        this.params3.getValue()[
          'filter.desc_vista'
        ] = `$ilike:${this.viewBody}`;
      }
      let param = {
        ...this.params3.getValue(),
        ...this.columnFilters3,
      };
      const name = this.formReport.get('nameReport').value;
      param['limit'] = '';
      this.massiveDepositaryService.getGuaranteExcel(param).subscribe({
        next: resp => {
          this.downloadDocument(`${name}`, 'excel', resp.base64File);
        },
        error: err => {
          console.log(err);
        },
      });
    }
  }

  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.loading = false;
    this.alert('success', 'Reporte Excel', 'Descarga Finalizada');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

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
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { GuarantyService } from 'src/app/core/services/ms-guaranty/guaranty.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AUCTION_REPORT_COLUMNS } from './auction-report-columns';

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
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

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
    private comerEventosService: ComerEventosService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: true,
      columns: { ...AUCTION_REPORT_COLUMNS },
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
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id_delegacion':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cuenta_fac':
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
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  /*data = [
    {
      allotment: 159,
      discountLot: '15%',
      type: 'Subasta',
      amount: '$123,123.00',
      validity: '20/02/2025',
      captureLine: '32132416549462136',
      status: 'Disponible',
      client: 'Juan Trejo Ramirez',
      rfc: 'XXXX0000',
      idClient: 645,
      discount: 'N/A',
    },
    {
      allotment: 987,
      discountLot: '5%',
      type: 'Venta',
      amount: '$654,321.00',
      validity: '18/02/2028',
      captureLine: '987946131654613',
      status: 'Disponible',
      client: 'Maria Cervantes Martinez',
      rfc: 'XXXX0000',
      idClient: 987,
      discount: 'N/A',
    },
    {
      allotment: 852,
      discountLot: '%10',
      type: 'Venta',
      amount: '$156,000.00',
      validity: '01/02/2023',
      captureLine: '456498732198762',
      status: 'No disponible',
      client: 'Enrique Baez Castillo',
      rfc: 'XXXX0000',
      idClient: 9876,
      discount: '$2,500.00',
    },
  ];*/

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

  /*getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }*/

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
    if (event) {
      this.form.get('lot').setValue(null);
      this.getLotPublic(new ListParams(), -1);
      console.log(event.id.id);
      this.getLotPublic(new ListParams(), event.id.id);
    } else {
      this.form.get('lot').setValue(null);
      this.getLotPublic(new ListParams(), -1);
    }
  }

  getLotPublic(params: ListParams, idEvent?: number | string) {
    if (idEvent) {
      params['filter.idEvent'] = `$eq:${idEvent}`;
    }
    if (params.text) {
      params['filter.comerLots.lotPublic'] = `$eq:${params.text}`;
    }
    this.guarantyService.getComerRefGuarantees(params).subscribe({
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
    this.form.get('customer').setValue(event.comerClient.idClient);
    this.getClient(new ListParams(), event.idlcg);
    this.getStatus(new ListParams(), event.idlcg);
  }

  getClient(params: ListParams, idEvent?: number | string) {
    if (idEvent) {
      params['filter.idlcg'] = `$eq:${idEvent}`;
    }
    if (params.text) {
      params['filter.comerClient.nameReason'] = `$eq:${params.text}`;
    }
    this.guarantyService.getComerRefGuarantees(params).subscribe({
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
    if (idEvent) {
      params['filter.idlcg'] = `$eq:${idEvent}`;
    }
    if (params.text) {
      params['filter.comerLots.lotPublic'] = `$eq:${params.text}`;
    }
    this.guarantyService.getComerRefGuarantees(params).subscribe({
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

  getDataSettlement(idEvent?: number | string) {
    this.loading = false;
    this.params.getValue()['filter.idEvent'] = `$eq:${idEvent}`;
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.guarantyService.getComerRefGuarantees(param).subscribe({
      next: resp => {
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

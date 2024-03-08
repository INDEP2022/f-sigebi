import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { BasePage } from 'src/app/core/shared/base-page';
//XLSX
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { TheadFitlersRowComponent } from 'ng2-smart-table/lib/components/thead/rows/thead-filters-row.component';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { LinkCellComponent } from 'src/app/@standalone/smart-table/link-cell/link-cell.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { _Params } from 'src/app/common/services/http.service';
import { InvoiceFolioSeparate } from 'src/app/core/models/ms-invoicefolio/invoicefolio.model';
import { IPupRepBillMore } from 'src/app/core/models/ms-ldocument/pgr-file.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { ComerDetailInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-dinvocie.service';
import { ComerElecBillService } from 'src/app/core/services/ms-invoice/ms-comer-elec-bill.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { ParameterInvoiceService } from 'src/app/core/services/ms-parameterinvoice/parameterinvoice.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BillingsService } from '../../../billing-m/services/services';
import { FolioModalComponent } from '../../../penalty-billing/folio-modal/folio-modal.component';
import { UseModalComponent } from '../../mass-bill-base-sales/sat-catalogs/use-comp/use-modal.component';
import { ActModalComponent } from './act-comp/act-modal.component';
import { AuthorizationModalComponent } from './authorization-modal/authorization-modal.component';
import { FactCanceladasComponent } from './fact-canceladas/fact-canceladas.component';
import { ReferenceModalComponent } from './reference/reference.component';

@Component({
  selector: 'app-regular-billing-invoice',
  templateUrl: './regular-billing-invoice.component.html',
  styles: [
    `
      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class RegularBillingInvoiceComponent extends BasePage implements OnInit {
  show1 = false;
  form: FormGroup = new FormGroup({});
  formDetalle: FormGroup = new FormGroup({});
  formFactura: FormGroup;
  dataFilter: LocalDataSource = new LocalDataSource();
  dataFilter2: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  columnFilters2: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  paramsList2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItems2: number = 0;
  isSelect: any[] = [];
  dataRebill: DefaultSelect = new DefaultSelect();
  loading2: boolean = false;
  buttons: boolean = false;
  isCancel: boolean = false;
  global: any = {
    canxp: '',
    pidgasto: '',
  };
  settings2 = {
    ...this.settings,
    actions: false,
  };
  parameter = {
    copias: 1,
    numfactimp: 1,
    numfactele: 1,
    autorizo: 0,
  };
  blk_actdat: any[] = [];
  limit: FormControl = new FormControl(500);
  rowInvoice: any = null;

  @Output() comer: EventEmitter<any> = new EventEmitter(null);
  @Output() formG: EventEmitter<FormGroup> = new EventEmitter();
  @Input() set sum(values: any) {}
  @Output() numb: EventEmitter<any> = new EventEmitter(null);
  val: any;

  get sum() {
    return this.val;
  }

  get idAllotment() {
    return this.form.get('idAllotment');
  }

  btnLoading: boolean = false;
  btnLoading1: boolean = false;
  btnLoading2: boolean = false;
  btnLoading3: boolean = false;
  btnLoading4: boolean = false;
  btnLoading5: boolean = false;
  btnLoading6: boolean = false;
  btnLoading7: boolean = false;
  btnLoading8: boolean = false;
  btnLoading9: boolean = false;
  btnLoading10: boolean = false;
  btnLoading11: boolean = false;
  btnLoading12: boolean = false;
  btnLoading13: boolean = false;
  btnLoading14: boolean = false;
  btnLoadAU: boolean = false;
  btnLoadAP: boolean = false;
  invoiceSelected: any = null;

  get xLote() {
    return this.formFactura.get('xLote');
  }
  path: string = '';
  @ViewChild('myTable', { static: false }) table: TheadFitlersRowComponent;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private excelService: ExcelService,
    private comerInvoice: ComerInvoiceService,
    private comerRebilService: ParameterInvoiceService,
    private comerDetInvoice: ComerDetailInvoiceService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private survillanceService: SurvillanceService,
    private dynamicService: DynamicCatalogsService,
    private parameterModService: ParameterModService,
    private goodProccess: GoodprocessService,
    private comerEleBillService: ComerElecBillService,
    private comerSpenService: SpentService,
    private comerEventService: ComerEventService,
    private parameterGoodService: ParameterCatService,
    private billingsService: BillingsService,
    private fileBrowserService: FileBrowserService
  ) {
    super();

    this.settings2.columns = {
      goodNot: {
        title: 'No. Bien',
        sort: false,
      },
      amount: {
        title: 'Cantidad',
        sort: false,
      },
      description: {
        title: 'Descripción',
        sort: false,
      },
      price: {
        title: 'Importe',
        sort: false,
        valuePrepareFunction: (val: string) => {
          const formatter = new Intl.NumberFormat('en-US', {
            currency: 'USD',
            minimumFractionDigits: 2,
          });

          return formatter.format(Number(val));
        },
      },
      vat: {
        title: 'Iva',
        sort: false,
        valuePrepareFunction: (val: string) => {
          const formatter = new Intl.NumberFormat('en-US', {
            currency: 'USD',
            minimumFractionDigits: 2,
          });

          return formatter.format(Number(val));
        },
      },
      total: {
        title: 'Total',
        sort: false,
        valuePrepareFunction: (val: string) => {
          const formatter = new Intl.NumberFormat('en-US', {
            currency: 'USD',
            minimumFractionDigits: 2,
          });

          return formatter.format(Number(val));
        },
      },
      brand: {
        title: 'Marca',
        sort: false,
      },
      subBrand: {
        title: 'Submarca',
        sort: false,
      },
      model: {
        title: 'Modelo',
        sort: false,
      },
      series: {
        title: 'Serie',
        sort: false,
      },
      downloadcvman: {
        title: 'Mandato',
        sort: false,
      },
      modmandato: {
        title: 'Matrícula',
        sort: false,
        // type: 'custom',
        // renderComponent: InputCellComponent,
        // onComponentInitFunction: (instance: any) => {
        //   instance.inputChange.subscribe({
        //     next: (resp: any) => {
        //       resp.row.modmandato = resp.value;
        //     },
        //   });
        // },
      },
      desc_unidad_det: {
        title: 'Unidad',
        sort: false,
        type: 'custom',
        renderComponent: LinkCellComponent<any>,
        onComponentInitFunction: (instance: LinkCellComponent<any>) => {
          instance.validateValue = false;
          instance.onNavigate.subscribe(async invoice => {
            if (this.rowInvoice.factstatusId != 'PREF') {
              this.alert('warning', 'Verifique el estatus de la factura', '');
            } else {
              let config = {
                initialState: {
                  name: 'C_UNIDMED',
                  callback: (
                    ans: boolean,
                    data: { clave: string; descripcion: string }
                  ) => {
                    this.updateCatalog(data, invoice, 1);
                  },
                },
                class: 'modal-lg modal-dialog-centered',
                ignoreBackdropClick: true,
              };
              this.modalService.show(UseModalComponent, config);
            }
          });
        },
      },
      desc_producto_det: {
        title: 'Prod./Serv.',
        sort: false,
        type: 'custom',
        renderComponent: LinkCellComponent<any>,
        onComponentInitFunction: (instance: LinkCellComponent<any>) => {
          instance.validateValue = false;
          instance.onNavigate.subscribe(async invoice => {
            if (this.rowInvoice.factstatusId != 'PREF') {
              this.alert('warning', 'Verifique el estatus de la factura', '');
            } else {
              let config = {
                initialState: {
                  name: 'C_CLVPROSE',
                  callback: (
                    ans: boolean,
                    data: { clave: string; descripcion: string }
                  ) => {
                    this.updateCatalog(data, invoice, 2);
                  },
                },
                class: 'modal-lg modal-dialog-centered',
                ignoreBackdropClick: true,
              };
              this.modalService.show(UseModalComponent, config);
            }
          });
        },
      },
    };

    this.settings2.hideSubHeader = false;

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      hideSubHeader: false,
      columns: {
        select: {
          title: 'Selección',
          sort: false,
          filter: false,
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: any) => {
            const time = setTimeout(() => {
              const index = this.isSelect.findIndex(
                comer =>
                  comer.eventId == instance.rowData.eventId &&
                  comer.billId == instance.rowData.billId
              );
              if (index != -1) {
                (instance.box.nativeElement as HTMLInputElement).checked = true;
              }
              clearTimeout(time);
            }, 300);
            instance.toggle.subscribe((data: any) => {
              instance.rowData.select = data.toggle;
              if (data.toggle) {
                this.isSelectComer(instance.rowData, 'add');
              } else {
                this.isSelectComer(instance.rowData, 'remove');
              }
            });
          },
        },
        eventId: {
          title: 'Evento',
          sort: false,
        },
        batchId: {
          title: 'Lote',
          sort: false,
        },
        customer: {
          title: 'Cliente',
          sort: false,
          type: 'custom',
          renderComponent: LinkCellComponent<any>,
          onComponentInitFunction: (instance: LinkCellComponent<any>) => {
            instance.validateValue = false;
            instance.onNavigate.subscribe(async invoice => {
              const count = await this.getCountReference(
                invoice.eventId,
                invoice.batchId
              );
              if (count == 0) {
                this.alert('warning', 'El Lote aún no está liberado', '');
              } else {
                let config = {
                  initialState: {
                    data: invoice,
                  },
                  class: 'modal-md modal-dialog-centered',
                  ignoreBackdropClick: true,
                };
                this.modalService.show(ReferenceModalComponent, config);
              }
            });
          },
        },
        delegationNumber: {
          title: 'Regional',
          sort: false,
          // filter: {
          //   type: 'custom',
          //   component: CustomFilterComponent,
          // },
        },
        Type: {
          title: 'Factura Para',
          sort: false,
          filter: {
            type: 'list',
            config: {
              selectText: 'Todos',
              list: [
                { value: 1, title: 'Vehículo' },
                { value: 2, title: 'Diversos c/Anexo' },
                { value: 3, title: 'Diversos s/Anexo' },
                { value: 4, title: 'Aeronaves' },
                { value: 5, title: 'Chatarra c/Anexo' },
                { value: 6, title: 'Chatarra s/Anexo' },
                { value: 7, title: 'Venta de Bases' },
              ],
            },
          },
          valuePrepareFunction: (value: any) => {
            if (value !== null) {
              if (value == '1') {
                return 'Vehículo';
              }
              if (value == '2') {
                return 'Diversos c/Anexo';
              }
              if (value == '3') {
                return 'Diversos s/Anexo';
              }
              if (value == '4') {
                return 'Aeronaves';
              }
              if (value == '5') {
                return 'Chatarra c/Anexo';
              }
              if (value == '6') {
                return 'Chatarra s/Anexo';
              }
              if (value == '7') {
                return 'Venta de Bases';
              } else {
                return '';
              }
            } else {
              return '';
            }
          },
        },
        factstatusId: {
          title: 'Estatus',
          sort: false,
        },
        series: {
          title: 'Serie',
          sort: false,
        },
        Invoice: {
          title: 'Folio',
          sort: false,
        },
        document: {
          title: 'Tipo',
          sort: false,
        },
        impressionDate: {
          title: 'Fecha',
          sort: false,
          valuePrepareFunction: (val: string) => {
            return val ? val.split('-').reverse().join('/') + ' 00:00:00' : '';
          },
          filterFunction: () => {
            return true;
          },
          filter: {
            type: 'custom',
            component: CustomDateFilterComponent,
          },
        },
      },
    };
  }

  async getCountReference(event: number, batchId: number) {
    return firstValueFrom(
      this.comerInvoice.getCountInvoice(event, batchId).pipe(
        map(resp => resp.contador),
        catchError(() => of(0))
      )
    );
  }

  updateCatalog(
    data: { clave: string; descripcion: string },
    invoice: any,
    type: number
  ) {
    switch (type) {
      case 1:
        invoice.unitSatKey = data.clave;
        break;
      case 2:
        invoice.prodservSatKey = data.clave;
        break;
      default:
        break;
    }

    delete invoice.desc_unidad_det;
    delete invoice.desc_producto_det;
    delete invoice.modmandato;

    this.comerDetInvoice.update(invoice).subscribe({
      next: () => {
        this.getComerDetInovice();
        this.alert('success', 'El Catálogo ha sido actualizado', '');
      },
      error: () => {},
    });
  }

  ngOnInit(): void {
    this.paramsList.getValue().limit = 500;
    this.paramsList2.getValue().limit = 500;
    this.paramsList.getValue()['filter.address'] = `${SearchFilter.EQ}:M`;
    this.paramsList.getValue()['sortBy'] = 'batchId,Invoice,customer:DESC';
    this.prepareForm();

    this.dataFilter
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              eventId: () => (searchFilter = SearchFilter.EQ),
              batchId: () => (searchFilter = SearchFilter.EQ),
              customer: () => (searchFilter = SearchFilter.ILIKE),
              delegationNumber: () => (searchFilter = SearchFilter.EQ),
              Type: () => (searchFilter = SearchFilter.EQ),
              document: () => (searchFilter = SearchFilter.ILIKE),
              series: () => (searchFilter = SearchFilter.ILIKE),
              Invoice: () => (searchFilter = SearchFilter.EQ),
              factstatusId: () => (searchFilter = SearchFilter.ILIKE),
              vouchertype: () => (searchFilter = SearchFilter.ILIKE),
              impressionDate: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              if (
                // filter.field == 'eventDate' ||
                filter.field == 'impressionDate'
              ) {
                filter.search = this.datePipe.transform(
                  filter.search,
                  'yyyy-MM-dd'
                );
              }
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getAllComer('SI');
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems > 0) this.getAllComer('SI1');
    });

    this.dataFilter2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              goodNot: () => (searchFilter = SearchFilter.EQ),
              amount: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              price: () => (searchFilter = SearchFilter.EQ),
              vat: () => (searchFilter = SearchFilter.EQ),
              total: () => (searchFilter = SearchFilter.EQ),
              brand: () => (searchFilter = SearchFilter.ILIKE),
              subBrand: () => (searchFilter = SearchFilter.ILIKE),
              model: () => (searchFilter = SearchFilter.ILIKE),
              series: () => (searchFilter = SearchFilter.ILIKE),
              downloadcvman: () => (searchFilter = SearchFilter.ILIKE),
              tuition: () => (searchFilter = SearchFilter.ILIKE),
              unit: () => (searchFilter = SearchFilter.ILIKE),
              prod: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.paramsList2 = this.pageFilter(this.paramsList2);
          this.getComerDetInovice();
        }
      });

    this.paramsList2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems2 > 0) this.getComerDetInovice();
    });
  }
  selectDataRow: any = null;
  getComerDetInvocie(data: any) {
    this.rowInvoice = data;
    this.selectDataRow = data;
    this.paramsList2.getValue()[
      'filter.eventId'
    ] = `${SearchFilter.EQ}:${data.eventId}`;
    this.paramsList2.getValue()[
      'filter.billId'
    ] = `${SearchFilter.EQ}:${data.billId}`;
    this.getComerDetInovice();
  }

  getComerDetInovice() {
    const params = {
      ...this.paramsList2.getValue(),
      ...this.columnFilters2,
    };
    if (!params['filter.billId'] && !params['filter.eventId']) {
      this.loading2 = false;
      this.totalItems2 = 0;
      this.dataFilter2.load([]);
      this.dataFilter2.refresh();
      this.formDetalle.reset();
    } else {
      this.loading2 = true;
      this.comerDetInvoice.getAllCustom(params).subscribe({
        next: async (resp: any) => {
          const data = await this.postQuery(params);
          this.formDetalle.get('count').patchValue(resp.count);
          this.formDetalle.get('totalI').patchValue(resp.data[0].sum.importe);
          this.formDetalle.get('totalIva').patchValue(resp.data[0].sum.iva);
          this.formDetalle.get('total').patchValue(resp.data[0].sum.total);
          this.formDetalle
            .get('countTotal')
            .patchValue(resp.data[0].sum.amount);
          this.totalItems2 = resp.count;

          const result = resp.data[0].result;

          result.map((value: any, index: number) => {
            value.desc_producto_det = data[index].desc_producto_det;
            value.desc_unidad_det = data[index].desc_unidad_det;
            value.downloadcvman = data[index].mandato;
            value.modmandato = data[index].matricula;
          });
          Promise.all(result).then(resp => {
            this.dataFilter2.load(result);
            this.dataFilter2.refresh();
            this.loading2 = false;
          });
        },
        error: () => {
          this.loading2 = false;
          this.totalItems2 = 0;
          this.dataFilter2.load([]);
          this.dataFilter2.refresh();
          this.formDetalle.reset();
        },
      });
    }
  }

  async postQuery(params: _Params) {
    return firstValueFrom(
      this.comerDetInvoice.getAllPostQuery(params).pipe(
        map(resp => resp.data),
        catchError(() => of([]))
      )
    );
  }

  async getAllComer(val?: string) {
    const params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
      //...{ sortBy: 'batchId:ASC' },
    };
    let res = await this.forArrayFilters_();
    console.log('res', res);
    if (res) {
      // this.paramsList = new BehaviorSubject<ListParams>(new ListParams());
      this.paramsList.getValue()['limit'] = 500;
      this.paramsList.getValue()['filter.address'] = `${SearchFilter.EQ}:M`;

      this.isSelect = [];
      this.rowInvoice = null;
      this.loading = false;
      this.totalItems = 0;
      this.dataFilter.load([]);
      this.dataFilter.refresh();
      this.formFactura.reset();
      this.formDetalle.reset();
      this.totalItems2 = 0;
      this.dataFilter2.load([]);
      this.dataFilter2.refresh();

      this.formFactura.get('importE').patchValue(0);
      this.formFactura.get('ivaE').patchValue(0);
      this.formFactura.get('totalE').patchValue(0);
      this.formFactura.get('importI').patchValue(0);
      this.formFactura.get('ivaI').patchValue(0);
      this.formFactura.get('totalI').patchValue(0);

      this.formDetalle.get('count').patchValue(0);
      this.formDetalle.get('totalI').patchValue(0);
      this.formDetalle.get('totalIva').patchValue(0);
      this.formDetalle.get('total').patchValue(0);
      this.formDetalle.get('countTotal').patchValue(0);

      delete this.paramsList.getValue()['filter.eventId'];
      delete this.paramsList2.getValue()['filter.eventId'];
      delete this.paramsList2.getValue()['filter.billId'];
    } else {
      this.loading = true;
      this.comerInvoice.getAllSumInvoice(params).subscribe({
        next: resp => {
          this.loading = false;
          this.formFactura.get('count').patchValue(resp.count);
          this.totalItems = resp.count;
          this.dataFilter.load(resp.data);
          this.dataFilter.refresh();

          if (resp.data[0]?.eventId)
            this.paramsList2.getValue()[
              'filter.eventId'
            ] = `${SearchFilter.EQ}:${resp.data[0].eventId}`;
          if (resp.data[0]?.billId)
            this.paramsList2.getValue()[
              'filter.billId'
            ] = `${SearchFilter.EQ}:${resp.data[0].billId}`;
          if (resp.count > 0) {
            this.rowInvoice = resp.data[0];
            this.getComerDetInovice();
            this.getSum();

            this.comer.emit({
              val: resp.data[0]?.eventId,
              count: resp.data.length,
              data: [],
              filter: params,
            });
          }
        },
        error: () => {
          this.loading = false;
          this.totalItems = 0;
          this.dataFilter.load([]);
          this.dataFilter.refresh();
          this.formFactura.reset();
          this.formDetalle.reset();
          this.totalItems2 = 0;
          this.dataFilter2.load([]);
          this.dataFilter2.refresh();
        },
      });
    }
    return;
    if (
      !params['filter.eventId'] &&
      !params['filter.batchId'] &&
      !params['filter.customer'] &&
      !params['filter.delegationNumber'] &&
      !params['filter.Type'] &&
      !params['filter.document'] &&
      !params['filter.series'] &&
      !params['filter.Invoice'] &&
      !params['filter.factstatusId'] &&
      !params['filter.vouchertype'] &&
      !params['filter.impressionDate']
    ) {
      // this.paramsList = new BehaviorSubject<ListParams>(new ListParams());
      this.paramsList.getValue()['limit'] = 500;
      this.paramsList.getValue()['filter.address'] = `${SearchFilter.EQ}:M`;

      this.isSelect = [];
      this.rowInvoice = null;
      this.loading = false;
      this.totalItems = 0;
      this.dataFilter.load([]);
      this.dataFilter.refresh();
      this.formFactura.reset();
      this.formDetalle.reset();
      this.totalItems2 = 0;
      this.dataFilter2.load([]);
      this.dataFilter2.refresh();

      this.formFactura.get('importE').patchValue(0);
      this.formFactura.get('ivaE').patchValue(0);
      this.formFactura.get('totalE').patchValue(0);
      this.formFactura.get('importI').patchValue(0);
      this.formFactura.get('ivaI').patchValue(0);
      this.formFactura.get('totalI').patchValue(0);

      this.formDetalle.get('count').patchValue(0);
      this.formDetalle.get('totalI').patchValue(0);
      this.formDetalle.get('totalIva').patchValue(0);
      this.formDetalle.get('total').patchValue(0);
      this.formDetalle.get('countTotal').patchValue(0);

      delete this.paramsList.getValue()['filter.eventId'];
      delete this.paramsList2.getValue()['filter.eventId'];
      delete this.paramsList2.getValue()['filter.billId'];
    } else {
      this.loading = true;
      this.comerInvoice.getAllSumInvoice(params).subscribe({
        next: resp => {
          this.loading = false;
          this.formFactura.get('count').patchValue(resp.count);
          this.totalItems = resp.count;
          this.dataFilter.load(resp.data);
          this.dataFilter.refresh();

          if (resp.data[0]?.eventId)
            this.paramsList2.getValue()[
              'filter.eventId'
            ] = `${SearchFilter.EQ}:${resp.data[0].eventId}`;
          if (resp.data[0]?.billId)
            this.paramsList2.getValue()[
              'filter.billId'
            ] = `${SearchFilter.EQ}:${resp.data[0].billId}`;
          if (resp.count > 0) {
            this.rowInvoice = resp.data[0];
            this.getComerDetInovice();
            this.getSum();

            this.comer.emit({
              val: resp.data[0]?.eventId,
              count: resp.data.length,
              data: [],
              filter: params,
            });
          }
        },
        error: () => {
          this.loading = false;
          this.totalItems = 0;
          this.dataFilter.load([]);
          this.dataFilter.refresh();
          this.formFactura.reset();
          this.formDetalle.reset();
          this.totalItems2 = 0;
          this.dataFilter2.load([]);
          this.dataFilter2.refresh();
        },
      });
    }
  }

  getSum() {
    const params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
      //...{ sortBy: 'batchId:ASC' },
    };
    this.comerInvoice.getSumTotal(params).subscribe({
      next: resp => {
        this.formFactura.get('importE').patchValue(resp.sumprecioeg);
        this.formFactura.get('ivaE').patchValue(resp.sumivaeg);
        this.formFactura.get('totalE').patchValue(resp.sumtotaleg);
        this.formFactura.get('importI').patchValue(resp.sumprecioing);
        this.formFactura.get('ivaI').patchValue(resp.sumivaing);
        this.formFactura.get('totalI').patchValue(resp.sumtotaling);
      },
      error: () => {},
    });
  }

  async generatePreFacture() {
    const { event, idAllotment } = this.form.value;
    if (!event) {
      this.alert('warning', 'Ingrese un evento para generar prefacturas', '');
      return;
    }

    this.btnLoading = true;
    // -- VALIDA QUE EXISTAN LOTES VALIDOS PARA FACTURAR --
    const count = await this.getCountBatch(event, idAllotment);

    if (count == 0) {
      this.alert(
        'warning',
        'No se encontraron Lotes con estatus válidos para facturar',
        ''
      );
      this.btnLoading = false;
      return;
    }

    // -- VALIDA QUE HAYA LOTES PARA FACTURAR --
    const valid = await this.getValidBatch(event, idAllotment);
    /* Se determinan las facturas que no se generan por mandatos no facturables */
    if (valid.cont_nofact > 0) {
      this.alert(
        'warning',
        `No se generan ${valid.cont_nofact} factura(s) por Mandatos no facturables.`,
        ``
      );
      this.btnLoading = false;
      return;
    }

    if (valid.contador == 0) {
      this.alert('warning', 'No se encontraron Lotes para facturar', '');
      this.btnLoading = false;
      return;
    }

    this.alertQuestion(
      'question',
      `Se generarán ${valid.contador} factura(s)`,
      '¿Desea continuar?'
    ).then(async ans => {
      if (ans.isConfirmed) {
        //en espera de revision de creacion facturas e inconsitencias
        // PK_COMER_FACTINM.PA_AJU_FACTURA_PAG
        const pk_comer: any = await this.packageInvoice({
          eventId: event,
          option: 0,
          publicLot: idAllotment,
          cveDisplay: 'FCOMER086_I',
          invoiceId: null,
          paymentId: null,
          document: 'FAC',
          secdoc: 'M',
          indGendet: 1,
          delegationNumber: null,
          command: null,
          partiality: null,
          type: null,
        });
        console.log('pk_comer', pk_comer);
        if (!pk_comer) {
          this.alert('warning', 'Ha ocurrido un fallo en la operación', '');
          this.btnLoading = false;
        } else if (pk_comer.p_RESUL == 'Correcto.') {
          // this.paramsList = new BehaviorSubject<ListParams>(new ListParams());
          this.paramsList.getValue()['limit'] = 500;
          this.paramsList.getValue()['filter.address'] = `${SearchFilter.EQ}:M`;
          this.paramsList.getValue()[
            'filter.eventId'
          ] = `${SearchFilter.EQ}:${event}`;
          await this.forArrayFilters('eventId', event);
          this.getAllComer();
          const params = new ListParams();
          params['filter.eventId'] = `$eq:${event}`; // COMER_INCONSISTENCIAS
          const countInconsistencias: any =
            await this.billingsService.getEatInconsistences(params);
          this.btnLoading = false;
          if (countInconsistencias.count > 0) {
            this.numb.emit({ numberTab: 2, event: event });
          }
        }
      } else {
        this.btnLoading = false;
      }
    });
  }

  async packageInvoice(data: any) {
    return firstValueFrom(
      this.comerInvoice.generatePreInvoice(data).pipe(
        map(resp => resp),
        catchError(() => of(null))
      )
    );
  }

  async getCountBatch(event: number, lote: number) {
    return firstValueFrom(
      this.comerInvoice.getCountBatch(event, lote).pipe(
        map(resp => resp.contador),
        catchError(() => of(0))
      )
    );
  }

  async getValidBatch(event: number, lote: number) {
    return firstValueFrom(
      this.comerInvoice.getValidBatch(event, lote).pipe(
        map(resp => resp),
        catchError(() => of(0))
      )
    );
  }

  async updateData() {
    let l_ban: boolean = false;
    this.blk_actdat = [];
    let n_cont: number = 0;
    let n_cone: number = 0;
    let n_conf: number = 0;
    const data = await this.dataFilter.getAll();
    if (data.length == 0) {
      this.alert('warning', 'Sin Factura(s) a trabajar', '');
      return;
    }

    for (const invoice of this.isSelect) {
      l_ban = true;

      if (this.blk_actdat[0]?.eventId) {
        for (const act of this.blk_actdat) {
          if (
            act.batchId == invoice.batchId &&
            act.eventId == invoice.eventId
          ) {
            l_ban = false;
            break;
          }
        }
      }

      if (l_ban) {
        n_cont++;
        const fact: any = {
          batchId: invoice.batchId,
          eventId: invoice.eventId,
          ind_con: 'S',
          cause: null,
        };
        this.blk_actdat.push(fact);
      }
    }

    if (n_cont == 0) {
      this.alert('warning', 'No se realizo selección de Factura(s)', '');
      return;
    }
    this.btnLoading3 = true;
    for (const act of this.blk_actdat) {
      const sumEat = await this.getSumEat(act.eventId, act.batchId);
      if (sumEat) {
        const { n_fac_tot, n_fac_cfdi, n_fac_fol, n_fac_imp, n_fac_pref } =
          sumEat;
        act.cause = `Facturas, Total: ${n_fac_tot ?? 0}, PREF: ${
          n_fac_pref ?? 0
        }, FOL: ${n_fac_fol ?? 0}, CFDI: ${n_fac_cfdi ?? 0}, IMP: ${
          n_fac_imp ?? 0
        }`;
        act.n_fac_cfdi = n_fac_cfdi ?? 0;
        act.n_fac_fol = n_fac_fol ?? 0;
        act.n_fac_imp = n_fac_imp ?? 0;
        act.n_fac_pref = n_fac_pref ?? 0;
        act.n_fac_tot = n_fac_tot ?? 0;

        if (
          n_fac_tot !=
          (n_fac_pref ?? 0) +
            (n_fac_imp ?? 0) +
            (n_fac_fol ?? 0) +
            (n_fac_cfdi ?? 0)
        ) {
          act.ind_con = 'N';
          act.cause = `Inconsistencia en Número de Facturas (Total: ${
            n_fac_tot ?? 0
          }, PREF: ${n_fac_pref ?? 0}, FOL: ${n_fac_fol ?? 0}, CFDI: ${
            n_fac_cfdi ?? 0
          }, IMP: ${n_fac_imp ?? 0})`;
          n_cone++;
        } else if ((n_fac_fol ?? 0) + (n_fac_pref ?? 0) == 0) {
          act.ind_con = 'N';
          act.cause = `Sin Factura(s) a actualizar (PREF: ${
            n_fac_pref ?? 0
          }, FOL: ${n_fac_fol ?? 0})`;
          n_cone++;
        } else {
          if ((n_fac_cfdi ?? 0) > 0) {
            l_ban = false;
            const type: any[] = await this.getType(act.eventId, act.batchId);

            for (const invoice of type) {
              const n_ind_group = await this.group(invoice.Type);
              if (n_ind_group == 1) {
                l_ban = true;
                break;
              }
            }

            if (l_ban) {
              act.ind_con = 'N';
              act.cause = `Se tienen Facturas en CFDI con anexo, Total: ${
                n_fac_tot ?? 0
              }, PREF: ${n_fac_pref ?? 0}, FOL: ${n_fac_fol ?? 0}, CFDI: ${
                n_fac_cfdi ?? 0
              }, IMP: ${n_fac_imp ?? 0}`;
              n_cone++;
            }
          }

          if (act.ind_con == 'S') {
            if ((n_fac_fol ?? 0) > 0) {
              if ((n_fac_imp ?? 0) > 0) {
                act.cause = `Se tienen Facturas con Folio e impresas, Total: ${
                  n_fac_tot ?? 0
                }, PREF: ${n_fac_pref ?? 0}, FOL: ${n_fac_fol ?? 0}, CFDI: ${
                  n_fac_cfdi ?? 0
                }, IMP: ${n_fac_imp ?? 0}`;
              } else {
                act.cause = `Se tienen Facturas con Folio, Total: ${
                  n_fac_tot ?? 0
                }, PREF: ${n_fac_pref ?? 0}, FOL: ${n_fac_fol ?? 0}, CFDI: ${
                  n_fac_cfdi ?? 0
                }, IMP: ${n_fac_imp ?? 0}`;
              }
              n_conf++;
            } else if ((n_fac_imp ?? 0) > 0) {
              act.cause = `Se tienen Facturas impresas, Total: ${
                n_fac_tot ?? 0
              }, PREF: ${n_fac_pref ?? 0}, FOL: ${n_fac_fol ?? 0}, CFDI: ${
                n_fac_cfdi ?? 0
              }, IMP: ${n_fac_imp ?? 0}`;
            }
          }
        }
      }
    }
    this.btnLoading3 = false;
    let config: ModalOptions = {
      initialState: {
        data: this.blk_actdat,
        totalItems: this.blk_actdat.length,
        callback: async (event: number) => {
          if (event) {
            this.paramsList.getValue()[
              'filter.eventId'
            ] = `${SearchFilter.EQ}:${event}`;
            this.paramsList.getValue()[
              'filter.address'
            ] = `${SearchFilter.EQ}:M`;
            await this.forArrayFilters('eventId', event);
            this.getAllComer();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ActModalComponent, config);
  }

  async group(type: number) {
    const params = new FilterParams();
    params.addFilter('type', type, SearchFilter.EQ);
    return firstValueFrom(
      this.comerInvoice.getIndGroup(params.getParams()).pipe(
        map(resp => (resp.data.length > 0 ? resp.data[0].indgroup : null)),
        catchError(() => of(null))
      )
    );
  }

  async getType(event: number, batchId: number) {
    const params = new FilterParams();
    params.addFilter('eventId', event, SearchFilter.EQ);
    params.addFilter('batchId', batchId, SearchFilter.EQ);
    params.addFilter('factstatusId', 'CFDI', SearchFilter.EQ);
    params.addFilter('document', 'FAC', SearchFilter.EQ);
    return firstValueFrom(
      this.comerInvoice.getAll(params.getParams()).pipe(
        map(resp => resp.data),
        catchError(() => of([]))
      )
    );
  }

  async getSumEat(event: number, batchId: number) {
    return firstValueFrom(
      this.comerInvoice.getSumEat(event, batchId).pipe(
        map(resp => resp),
        catchError(() => of(null))
      )
    );
  }

  async generateInvoice() {
    const user = this.authService.decodeToken();
    this.btnLoading10 = true;
    const userValid = await this.validUser(user.preferred_username);
    let n_cont: number;
    let c_ind: string;
    let n_id_event: number;
    const { event, idAllotment } = this.form.value;

    if (userValid == 1) {
      // Cambiar a 0 //
      this.btnLoading10 = false;
      this.alert(
        'warning',
        'No cuenta con permisos para efectuar esta operación',
        ''
      );
    } else {
      n_cont = 0;

      if (event) {
        c_ind = 'F';
        n_id_event = event;
        n_cont = await this.countComerInvoice(event, idAllotment);
      } else {
        c_ind = 'S';

        let data: any[] = await this.dataFilter.getAll();

        if (data.length == 0) {
          this.btnLoading10 = false;
          this.alertInfo('warning', 'Sin factura(s) para trabajar', '');
          return;
        }
        let arr = [];
        for (const invoice of this.isSelect) {
          if (!n_id_event) {
            n_id_event = invoice.eventId;
          }
          if (invoice.factstatusId == 'PREF') {
            n_cont++;
            arr.push(invoice);
          }
        }
        this.isSelect = arr;
        this.dataFilter.refresh();
      }

      if (n_cont == 0) {
        this.alert('warning', 'Sin prefacturas para asignar folios', '');
        this.btnLoading10 = false;
        return;
      }

      this.alertQuestion(
        'question',
        `Se asignarán ${n_cont} folio(s)`,
        '¿Desea continuar?'
      ).then(ans => {
        if (ans.isConfirmed) {
          // PUP_NVO_GENERA_FOLIOS
          this.newGenerateInvoice(c_ind, n_id_event);
        } else {
          this.btnLoading10 = false;
        }
      });
    }
  }

  async newGenerateInvoice(c_ind: string, n_id_event: number) {
    let departament = this.authService.decodeToken().department;
    let c_indN = c_ind;
    let event = n_id_event;

    const tp_event = await this.getIdTpEvent(event);

    // VALIDAFOL := VALIDA_FOLIOS_DISPO(n_ID_EVENTO);
    const valid = await this.validaFolAvaliable(
      String(n_id_event),
      this.isSelect[0]?.tpevent ?? tp_event
    );

    if (valid == 1) {
      await this.updateDoc(n_id_event);

      await this.newMarkProcess('FL', 'PREF', c_indN);
      console.log({ pEvent: String(event), ptpevento: tp_event });
      await this.generateInvoiceCtrl(String(event), tp_event);

      if (c_indN == 'F') {
        // this.paramsList = new BehaviorSubject<ListParams>(new ListParams());
        this.paramsList.getValue()[
          'filter.eventId'
        ] = `${SearchFilter.EQ}:${event}`;
        this.paramsList.getValue()['filter.address'] = `${SearchFilter.EQ}:M`;
        // this.getAllComer();
      }

      //procedimiento verifica prov cance
      this.verifyProv(event);
      this.btnLoading10 = false;
    } else {
      this.btnLoading10 = false;
      this.alert('warning', 'No existen folios disponibles', '');
    }
  }

  async verifyProv(event: any) {
    const data = this.isSelect;
    for (const invoice of data) {
      if (
        invoice.archImgtemp &&
        invoice.billId &&
        invoice.factstatusId != 'CAN'
      ) {
        invoice.factstatusId = 'FOL';
        delete invoice.delegation;
        await this.updateInvoice(invoice);
      }
    }
    this.paramsList.getValue()[
      'filter.eventId'
    ] = `${SearchFilter.EQ}:${event}`;
    this.paramsList.getValue()['filter.address'] = `${SearchFilter.EQ}:M`;
    await this.forArrayFilters('eventId', event);
    this.getAllComer();
    this.alert('success', 'Proceso terminado correctamente', '');
  }

  async generateInvoiceCtrl(pEvent: string, ptpevento: string) {
    return firstValueFrom(
      this.comerInvoice.generateFolio({ pEvent, ptpevento }).pipe(
        map(() => true),
        catchError(() => of(false))
      )
    );
  }

  async newMarkProcess(process: string, statusValid: string, p_ind: string) {
    let c_nd = p_ind;
    let aux_status = statusValid;
    let aux_valgasto: number;
    let aux_val_liq: number;
    let cont: number = 0;
    let contg: number = 0;
    const { event, idAllotment } = this.form.value;

    if (c_nd == 'F') {
      const re_facts = await this.invoiceF(event, idAllotment, aux_status);
      for (const invoice of re_facts) {
        if (!invoice.billRelimagId && !invoice.eventRelimagId) {
          aux_valgasto = await this.subTotalPrice(
            invoice.eventId,
            invoice.batchId
          );
          if (aux_valgasto == 0) {
            aux_val_liq = await this.batchLiq(invoice.eventId, invoice.batchId);
            if (aux_val_liq == 1) {
              await this.updateProcess(
                invoice.eventId,
                invoice.billId,
                process
              );
            } else {
              cont++;
            }
          } else if (aux_valgasto >= 1) {
            contg++;
          }
        } else {
          await this.updateProcess(invoice.eventId, invoice.billId, process);
        }
      }
    } else {
      for (const invoice of this.isSelect) {
        if (!invoice.billRelimagId && !invoice.eventRelimagId) {
          aux_valgasto = await this.subTotalPrice(
            invoice.eventId,
            invoice.batchId
          );
          if (aux_valgasto == 0) {
            aux_val_liq = await this.batchLiq(invoice.eventId, invoice.batchId);
            if (aux_val_liq == 1) {
              invoice.process = process;
              delete invoice.delegation;
              await this.updateInvoice(invoice);
            } else {
              cont++;
            }
          } else if (aux_valgasto >= 1) {
            contg++;
          }
        } else {
          invoice.process = process;
          delete invoice.delegation;
          await this.updateInvoice(invoice);
        }
      }

      if (cont == 1 && aux_val_liq == 0) {
        this.alert(
          'warning',
          'Atención',
          `No se generará el folio de la factura. El lote ${
            this.isSelect[this.isSelect.length - 1].batchId
          } no ha sido afectado`
        );
      } else if (cont > 1 && aux_val_liq == 0) {
        this.alert(
          'warning',
          `${cont} facturas no pueden ser foliadas, sus lotes no han sido afectados`,
          ''
        );
      }

      if (contg == 1 && aux_valgasto == 1) {
        this.alert(
          'warning',
          'Atención',
          `No se generara el folio de la factura. El lote ${
            this.isSelect[this.isSelect.length - 1].batchId
          } no cumple las validaciones de los montos(chatarra)`
        );
      } else if (cont > 1 && aux_val_liq == 0) {
        this.alert(
          'warning',
          'Atención',
          `${contg} facturas no pueden ser foliadas, no cumplen las validaciones de los montos(chatarra)`
        );
      }
    }

    return true;
  }
  async putApplicationPutProcess(data: any) {
    return firstValueFrom(
      this.comerInvoice.putApplicationPutProcess(data).pipe(
        map(resp => {
          return true;
        }),
        catchError(() => of(false))
      )
    );
  }

  async updateProcess(eventId: number, billId: number, process: string) {
    return firstValueFrom(
      this.comerInvoice.updateEventCursor({ eventId, billId, process }).pipe(
        map(resp => {
          return true;
        }),
        catchError(() => of(false))
      )
    );
  }

  async subTotalPrice(eventId: number, batchId: number) {
    return firstValueFrom(
      this.comerInvoice.checkFolSubTotal({ eventId, batchId }).pipe(
        map(resp => resp.vRes),
        catchError(() => of(1))
      )
    );
  }

  async batchLiq(event: number, batchId: number) {
    return firstValueFrom(
      this.comerEventService.validateLiq(event, batchId).pipe(
        map(resp => resp.valLiq),
        catchError(() => of(0))
      )
    );
  }

  async invoiceF(event: number, batchId: number, status: string) {
    return firstValueFrom(
      this.comerInvoice.getCursosData(event, status, batchId).pipe(
        map(resp => resp.data),
        catchError(() => of([]))
      )
    );
  }

  async updateDoc(event: number) {
    return firstValueFrom(
      this.comerInvoice.updateEvent(event).pipe(
        map(resp => {
          return true;
        }),
        catchError(() => of(false))
      )
    );
  }

  async validaFolAvaliable(event: string, tpevent: string) {
    return firstValueFrom(
      this.comerInvoice
        .validateFolio({
          id_evento: event,
          tpEvento: tpevent,
        })
        .pipe(
          map(resp => resp.rspta),
          catchError(() => of(0))
        )
    );
  }

  async getIdTpEvent(event: number) {
    const params = new FilterParams();
    params.addFilter('eventId', event, SearchFilter.EQ);

    return firstValueFrom(
      this.comerInvoice.getAll(params.getParams()).pipe(
        map(resp => resp.data[0].tpevent),
        catchError(() => of(null))
      )
    );
  }

  async countComerInvoice(event: number, batchId: number) {
    const params = new FilterParams();

    params.addFilter('eventId', event, SearchFilter.EQ);
    if (batchId) params.addFilter('batchId', batchId, SearchFilter.EQ);
    params.addFilter('factstatusId', 'PREF', SearchFilter.EQ);
    return firstValueFrom(
      this.comerInvoice.getAll(params.getParams()).pipe(
        map(resp => resp.count),
        catchError(() => of(0))
      )
    );
  }

  async removeInvoice() {
    const data: any[] = await this.dataFilter.getAll();

    if (data.length == 0) {
      this.alert('warning', 'Debe seleccionar un evento', '');
      return;
    }

    let aux = 0;
    this.btnLoading11 = true;
    aux = this.validateRemoveInvoice();

    if (aux == 1) {
      await this.markProcess('EF', 'FOL');
      //update seleccionados
    }

    // COMER_CTRLFACTURA.ELIMINA_FOLIOS(:COMER_FACTURAS.ID_EVENTO, NULL);
    this.comerInvoice
      .deleteFolio({ eventId: data[0].eventId, invoiceId: null })
      .subscribe({
        next: () => {
          this.btnLoading11 = false;
          this.alert('success', 'Folios', 'Eliminados Correctamente');
          this.getAllComer();
        },
        error: err => {
          if (err.status == 400) {
            this.btnLoading11 = false;
            this.alert('warning', 'No se encontraron registros', '');
          } else {
            this.btnLoading11 = false;
            this.alert(
              'error',
              'Ocurrió un error al intentar eliminar los folios',
              err.error.message
            );
          }
        },
      });
  }

  validateRemoveInvoice(): number {
    for (const invoice of this.isSelect) {
      if (invoice.factstatusId != 'FOL') {
        this.btnLoading11 = false;
        this.alert(
          'warning',
          'Soló se puede eliminar folios de facturas con estatus FOL',
          'Si lo desea puede cancelarla'
        );
        return 0;
      }
    }

    return 1;
  }

  isSelectComer(data: any, operation: string) {
    if (operation == 'add') {
      delete data.select;
      const index = this.isSelect.findIndex(
        comer => comer.eventId == data.eventId && comer.billId == data.billId
      );
      if (index == -1) this.isSelect.push(data);
    } else {
      delete data.select;
      const index = this.isSelect.findIndex(
        comer => comer.eventId == data.eventId && comer.billId == data.billId
      );
      this.isSelect.splice(index, 1);
      this.isSelect = [...this.isSelect];
    }
  }

  getRebillData(params?: ListParams) {
    params['filter.apply'] = `${SearchFilter.IN}:F,A`;
    params['filter.valid'] = `${SearchFilter.EQ}:S`;
    params['sortBy'] = 'id:ASC';

    this.comerRebilService.getAll(params).subscribe({
      next: resp => {
        this.dataRebill = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.dataRebill = new DefaultSelect();
      },
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null],
      idAllotment: [null],
      iva: [null],
      date: [null],
      causerebillId: [null],
      check: [null],
      delegation: [null],
      userV: [null, Validators.required],
      passwordV: [null],
      folio: [null],
      refactura: [null],
    });

    this.formFactura = this.fb.group({
      importE: [0],
      ivaE: [0],
      totalE: [0],
      count: [0],
      importI: [0],
      ivaI: [0],
      totalI: [0],
      order: [null],
      xLote: [null],
    });

    this.formDetalle = this.fb.group({
      count: [0],
      totalI: [0],
      totalIva: [0],
      total: [0],
      countTotal: [0],
    });
  }

  disabledButtons() {
    const { check } = this.form.value;
    this.buttons = check;
  }

  sendPack() {
    this.alertQuestion(
      'warning',
      'Precaución',
      'Se enviará el paquete de los documentos a las regionales ¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  openFolioModal() {
    if (this.isSelect.length == 0)
      return this.alert('warning', 'Debe seleccionar una factura', '');

    let config: ModalOptions = {
      initialState: {
        callback: async (next: boolean, data: InvoiceFolioSeparate) => {
          if (next) {
            // const invoice: any[] = await this.dataFilter.getAll();
            // const index = invoice.findIndex(inv => inv == this.isSelect[0]);
            // invoice[index].series = data.series;
            // invoice[index].folioinvoiceId = data.folioinvoiceId;
            // invoice[index].Invoice = data.invoice;
            // invoice[index].factstatusId = 'FOL';

            const invoice = this.isSelect[0];
            invoice.series = data.series;
            invoice.folioinvoiceId = data.folioinvoiceId;
            invoice.Invoice = data.invoice;
            invoice.factstatusId = 'FOL';
            delete invoice.delegation;
            let resp = await this.updateInvoice(invoice);
            if (!resp) {
              return this.alert(
                'warning',
                'No se pudo actualizar la factura',
                ''
              );
            } else {
              this.getAllComer();
              this.rowInvoice = null;
              this.alert('success', 'Factura actualizada correctamente', '');
            }
            //this.dataFilter.load(invoice);
            //this.dataFilter.refresh();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(FolioModalComponent, config);
  }

  async track() {
    if (this.isSelect.length == 0)
      return this.alert('warning', 'Debe seleccionar al menos una factura', '');

    const desc = this.isSelect.length > 0 ? this.isSelect[0].declassify : null;
    if (this.selectInovice() == 1 && desc == 'S') {
      // -- Vehiculos tractocamion sin placas federales
      this.alert(
        'warning',
        'El Bien ya se encuentra como tractocamión sin placas federales',
        ''
      );
      this.removeSelect();
    } else if (this.selectInovice() == 1 && !desc) {
      // -- Cambio a Vehiculos tractocamion sin placas federales
      const invoice = this.isSelect[0];
      invoice.declassify = 'S';
      delete invoice.invoiceStatusId;
      delete invoice.usoComp;
      delete invoice.unite;
      delete invoice.prod;
      delete invoice.payment;
      delete invoice.relation;
      delete invoice.delegation;

      let resp = await this.updateInvoice(invoice);
      if (resp) {
        // const current: any[] = await this.dataFilter.getAll();
        // const index = current.findIndex(inv => inv == this.isSelect[0]);
        // current[index].factstatusId = 'IMP';
        // this.dataFilter.load(current);
        // this.dataFilter.refresh();
        this.getAllComer();
        this.removeSelect();
        this.alert('success', 'Cambio a vehiculos tractocamión', '');
      } else {
        this.getAllComer();
        this.alert('warning', 'No se pudo realizar el cambio', '');
      }
    }
  }

  selectInovice(): number {
    return this.isSelect.length > 0 ? 1 : 0;
  }

  async removeSelect() {
    // DESELECCIONA
    const data: any[] = await this.dataFilter.getAll();
    const event = data.length > 0 ? data[0].eventId : null;

    if (!event) {
      this.alert('warning', 'Debe consultar un evento', '');
      return;
    }

    this.isSelect = [];
    data.map(invoice => {
      invoice.select = false;
    });
    this.dataFilter.load(data);
    this.dataFilter.refresh();
  }

  async impresionCE() {
    const num = this.selectInovice();
    const { delegation } = this.form.value;
    if (num == 0 && !delegation) {
      await this.markAll();
      this.impresionCardEnt(1);
    } else if (num == 1 && !delegation) {
      this.impresionCardEnt(0);
    } else if (num == 0 && delegation) {
      await this.markAll();
      this.impresionCardEnt(1);
    }
  }

  impresionCardEnt(option: number) {
    for (let invoice of this.isSelect) {
      this.callReport(
        12,
        1,
        Number(invoice.Type),
        1,
        invoice.eventId,
        invoice.billId,
        invoice.impressionDate
      );
      break;
    }
    this.removeSelect();
  }

  async callReport(
    pTipo: number,
    pModo: number,
    psubtipo: number,
    pcopias: number,
    eventId: number,
    factura: number,
    impressionDate: string
  ) {
    const count = await this.getCount(eventId, factura);
    console.log(count);
    const data = {
      PEVENTO: eventId,
      PFACTURA: factura,
    };
    console.log('data ', data);
    if (pTipo == 1) {
      if (count > 0) {
        // this.getReportNull();
        this.getReport('RCOMERFACTURAS_VEH_VNR', data); // FUNCIONA
      } else {
        // this.getReportNull();
        this.getReport('RCOMERFACTURAS_VEH', data); // VERIFICAR
      }
    } else if (pTipo == 2) {
      const v_val = await this.etapaNexo(impressionDate);
      console.log('v_val', v_val);
      if (v_val == 1) {
        // this.getReportNull();
        this.getReport('RCOMERFACTURAS_DIVERSOS', data); // FUNCIONA
      } else if (v_val == 2) {
        this.getReport('RCOMERFAC_GRALSNANX', data); // FUNCIONA
        // this.getReportNull();
      } else {
        this.alert('warning', 'No se puede visualizar el reporte', '');
      }
    } else if (pTipo == 3) {
      if (count > 0) {
        // this.getReportNull();
        this.getReport('RCOMERFACTURAS_DIV_SA_VNR', data);
      } else {
        // this.getReportNull();
        this.getReport('RCOMERFACTURAS_DIVSANEXO', data); // FUNCIONA
      }
    } else if (pTipo == 4) {
      if (count > 0) {
        this.getReport('RCOMERFACTURAS_AERONAVE_VNR', data); // SI
      } else {
        this.getReport('RCOMERFACTURAS_AERONAVE', data); // FUNCIONA
      }
    } else if (pTipo == 5) {
      const v_val = await this.etapaNexo(impressionDate);
      console.log(v_val);
      if (v_val == 1) {
        this.getReport('RCOMERFACTURAS_CHCONANEXO', data); // FUNCIONA
        // this.getReportNull();
      } else if (v_val == 2) {
        this.getReport('RCOMERFAC_GRALSNANX', data); // FUNCIONA
        // this.getReportNull();
      } else {
        this.alert('warning', 'No se puede visualizar el reporte', '');
      }
    } else if (pTipo == 6) {
      this.getReport('RCOMERFACTURAS_CHATARRA_SA', data); // FUNCIONA
    } else if (pTipo == 10) {
      this.getReport('RCOMERFACTURAS_ANEXOS', data); // FUNCIONA
    } else if (pTipo == 11 && psubtipo == 1) {
      this.getReport('RCOMERCONSENTVEH', data); // FUNCIONA
    } else if (pTipo == 11 && psubtipo == 2) {
      // PARA IMPRIMIR CARTAS DE RESPONSABILIDAD DE AERONAVES
      this.getReport('RCOMERCONSENTBDCA', data); // FUNCIONA
    } else if (pTipo == 11 && psubtipo == 3) {
      this.getReport('RCOMERCONSENTSBD', data); // FUNCIONA
    } else if (pTipo == 11 && psubtipo == 4) {
      this.getReport('RCOMERCONSENTAERO', data); // FUNCIONA
    } else if (pTipo == 11 && psubtipo == 5) {
      this.getReport('RCOMERCONSENTCHCA', data); // FUNCIONA
    } else if (pTipo == 11 && psubtipo == 6) {
      this.getReport('RCOMERCONSENTCHSA', data); // FUNCIONA
    } else if (pTipo == 12 && [1, 2, 3, 4, 5, 6].includes(psubtipo)) {
      // this.getReport('RCOMERCARTASLIB', { PEVENTO: eventId });
      this.getReportNull();
    }
  }

  getReport(name: string, params: Object) {
    this.siabService.fetchReport(name, params).subscribe({
      next: resp => {
        const blob = new Blob([resp], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }
  getReportNull(name?: string, params?: Object) {
    this.siabService.fetchReportBlank('blank').subscribe({
      next: resp => {
        const blob = new Blob([resp], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }

  async etapaNexo(date: string) {
    return firstValueFrom(
      this.survillanceService.getFaEtapaAnexo({ faFec: date }).pipe(
        map(resp => resp.fa_etapanexo),
        catchError(error => of(0))
      )
    );
  }

  async getCount(eventId: number, factura: number) {
    return firstValueFrom(
      this.comerInvoice.getCountDescription(eventId, factura).pipe(
        map(resp => resp.val_tcan),
        catchError(error => of(0))
      )
    );
  }

  async markAll() {
    const { date, delegation } = this.form.value;
    const user = this.authService.decodeToken().username.toUpperCase();
    const data = await this.dataFilter.getAll();
    const valid = await this.validUser(user);

    if (valid == 0) {
      this.alert(
        'warning',
        'No cuenta con los permisos para efectuar esta operación',
        ''
      );
    } else {
      const event = data.length > 0 ? data[0].eventId : null;

      if (!event) {
        this.alert('warning', 'Debe consultar un evento', '');
        return;
      }

      if (date) {
        for (let invoice of data) {
          invoice.impressionDate = this.datePipe.transform(date, 'yyyy-MM-dd');
          delete invoice.invoiceStatusId;
          delete invoice.usoComp;
          delete invoice.unite;
          delete invoice.prod;
          delete invoice.payment;
          delete invoice.relation;
          delete invoice.regional;
          delete invoice.delegation;
          await this.updateInvoice(invoice);
        }
        this.form.get('date').patchValue(null);
        this.getAllComer();
      } else {
        const regional = this.authService.decodeToken().department;

        if (valid == 2) {
          for (let invoice of data) {
            if (invoice.delegationNumber == regional) {
              if (invoice.select) {
                this.isSelectComer(invoice, 'remove');
              } else {
                this.isSelectComer(invoice, 'add');
              }
            }
          }
        } else if (valid == 1) {
          for (let invoice of data) {
            if (invoice.delegationNumber == (delegation ?? regional)) {
              if (invoice.select) {
                this.isSelectComer(invoice, 'remove');
              } else {
                this.isSelectComer(invoice, 'add');
              }
            }
          }
        }
      }
    }
  }

  async updateInvoice(data: any) {
    return firstValueFrom(
      this.comerInvoice.update(data).pipe(
        map(() => true),
        catchError(() => of(false))
      )
    );
  }

  async validUser(user: string) {
    return firstValueFrom<number>(
      this.comerInvoice.validUser2(user).pipe(
        map(resp => resp.lValUsu),
        catchError(error => of(0))
      )
    );
  }

  visualizarCE() {
    if (this.isSelect.length == 0) {
      this.alert('warning', 'Favor de seleccionar una factura', '');
      return;
    }
    // LLAMA_REPORTE (12, 2, :COMER_FACTURAS.TIPO, 1);
    this.callReport(
      12,
      2,
      Number(this.isSelect[0].Type),
      1,
      this.isSelect[0].eventId,
      this.isSelect[0].billId,
      this.isSelect[0].impressionDate
    );
  }

  visualizarCR() {
    if (this.isSelect.length == 0) {
      this.alert('warning', 'Favor de seleccionar una factura', '');
      return;
    }

    this.callReport(
      11,
      2,
      Number(this.isSelect[0].Type),
      1,
      this.isSelect[0].eventId,
      this.isSelect[0].billId,
      this.isSelect[0].impressionDate
    );
  }

  async impresionCR() {
    const num = this.selectInovice();
    const { delegation } = this.form.value;
    if (num == 0 && !delegation) {
      // -- TODOS LAS CARTAS DE RESPONSABILIDAD
      this.changeOpt(3); // ORDENA_DATOS (3);
      await this.markAll();
      this.impresionCardResp(1);
    } else if (num == 1 && !delegation) {
      // -- SOLO CARTAS DE RESPONSABILIDAD SELECCIONADOS DISCONTINUOS
      this.impresionCardResp(0);
    } else if (num == 0 && delegation) {
      // -- CARTAS DE RESPONSABILIDAD SELECCIONADOS DE UNA REGIONAL
      this.changeOpt(3); // ORDENA_DATOS (3);
      await this.markAll();
      this.impresionCardResp(1);
    }
  }

  impresionCardResp(option: number) {
    for (let invoice of this.isSelect) {
      this.callReport(
        11,
        1,
        Number(invoice.Type),
        1,
        invoice.eventId,
        invoice.billId,
        invoice.impressionDate
      );
      break;
    }
    this.removeSelect();
  }

  async actMatricula() {
    if (this.isSelect.length == 0) {
      this.alert('warning', 'Favor de seleccionar una factura', '');
      return;
    }

    this.btnLoading9 = true;
    const data = this.isSelect[0];
    // const data = this.rowInvoice;

    if (data.factstatusId == 'PREF') {
      const data2 = await this.dataFilter2.getAll();

      if (data2[0].modmandato ?? false) {
        const exist = await this.exist();

        if (exist > 0) {
          const count = await this.countGood(data2[0].goodNot);

          if (count > 0) {
            this.goodProccess
              .updateVal5({ val5: data2[0].modmandato }, data2[0].goodNot)
              .subscribe({
                next: () => {
                  this.alert('success', 'Matrícula ha sido actualizada', '');
                  this.getComerDetInovice();
                  this.btnLoading9 = false;
                  this.rowInvoice = null;
                },
                error: err => {
                  this.btnLoading9 = false;
                  this.alert('error', err.error.message, '');
                },
              });
          } else {
            this.btnLoading9 = false;
            this.alert('warning', 'Bien no válido para realizar el cambio', '');
          }
        } else {
          this.btnLoading9 = false;
          this.alert('warning', 'Usuario inválido para realizar el cambio', '');
        }
      } else {
        this.btnLoading9 = false;
        this.alert('warning', 'Debe ingresar la Matrícula', '');
      }
    } else {
      this.btnLoading9 = false;
      this.alert(
        'warning',
        'Estatus de la Factura inválida para realizar el cambio',
        ''
      );
    }
  }

  async exist() {
    const filter = new ListParams();
    const user = this.authService.decodeToken().preferred_username;
    filter['filter.value'] = `${SearchFilter.EQ}:${'LGONZALEZG' ?? user}`;
    filter['filter.parameter'] = `${SearchFilter.EQ}:SUPUSUFACT`;
    return firstValueFrom(
      this.parameterModService.getAll(filter).pipe(
        map(resp => resp.count),
        catchError(() => of(0))
      )
    );
  }

  async countGood(good: number) {
    return firstValueFrom(
      this.goodProccess.getCount(good).pipe(
        map(resp => resp.n_cont),
        catchError(() => of(0))
      )
    );
  }

  async postQueryDet(data: {
    noTransferee: number;
    cveUnidSat: string;
    cveProdservSat: string;
  }) {
    return firstValueFrom(
      this.dynamicService.getPostQuery(data).pipe(
        map(resp => resp),
        catchError(() => of(null))
      )
    );
  }

  sendPackage() {
    this.alertQuestion(
      'question',
      'Se enviara el paquete de los documentos a las regionales',
      '¿Desea Continuar?'
    ).then(async question => {
      if (question.isConfirmed) {
        // IMPRIME_PAQUETE;
        await this.impresioPackage();

        this.alert('success', 'Se envió el paquete a la regional', '');
      }
    });
  }

  openURL() {
    if (this.selectInovice() == 1) {
      window.open('http://facturacionelec.sae.gob.mx/Log.aspx', '_blank');
    } else {
      this.alert('warning', 'Debe seleccionar un evento', '');
    }
  }

  async impresionAnex() {
    const num = this.selectInovice();
    const { delegation } = this.form.value;
    if (num == 0 && !delegation) {
      this.changeOpt(3); // ORDENA_DATOS (3);
      await this.markAll();
      this.impresionAnexReport(1); // IMPRIMIR_ANEXOS
      this.removeSelect();
    } else if (num == 1 && !delegation) {
      this.impresionAnexReport(0); // IMPRIMIR_ANEXOS
    } else if (num == 0 && delegation) {
      this.changeOpt(3); // ORDENA_DATOS (3);
      await this.markAll();
      this.impresionAnexReport(1); // IMPRIMIR_ANEXOS
      this.removeSelect();
    }
  }

  impresionAnexReport(option: number) {
    for (let invoice of this.isSelect) {
      //revisar con procedimiento pup_rep_facturas_mas
      // this.pupRepBillMore(10, invoice.Type, invoice)
      this.callReport(
        10,
        1,
        null,
        1,
        invoice.eventId,
        invoice.billId,
        invoice.impressionDate
      );
      break;
    }
  }

  async imprimeInvoice() {
    if (this.selectInovice() == 0) {
      this.alert('warning', 'Debes seleccionar algún evento', '');
      return;
    }

    if (!this.isSelect[0].Invoice) {
      this.alert('warning', 'No ha capturado el folio de la factura', '');
      return;
    }
    this.btnLoading2 = true;
    await this.readParameter();

    this.impresionInvoice();
  }

  async impresionInvoice() {
    for (let invoice of this.isSelect) {
      // let invoice = this.isSelect[0];
      if (!invoice.Invoice) {
        this.alert('warning', 'No ha capturado el folio de la factura', '');
        break;
      }
      //revisar con procedimiento pup_rep_facturas_mas
      this.callReport(
        Number(invoice.Type),
        1,
        null,
        this.parameter.copias,
        invoice.eventId,
        invoice.billId,
        invoice.impressionDate
      );

      let factstatusId = invoice.factstatusId;
      let delegation = invoice.delegation;

      invoice.factstatusId = 'IMP';
      delete invoice.delegation;

      let resp = await this.updateInvoice(invoice);
      if (resp) {
        const current: any[] = await this.dataFilter.getAll();
        console.log(current);
        const index = current.findIndex(inv => inv == this.isSelect[0]);
        console.log(current[0]);
        current[0].factstatusId = 'IMP';
        current[0]['delegation'] = delegation;
        // Realizar DesSelección
        this.desSelectOne(current[0]);
        // this.dataFilter.load(current);
        this.dataFilter.refresh();
        this.btnLoading2 = false;
      } else {
        invoice.delegation = delegation;
        invoice.factstatusId = factstatusId;
        this.btnLoading2 = false;
      }
      break;
    }
  }
  async desSelectOne(bill: any) {
    let arr = [];
    for (const invoice of this.isSelect) {
      if (invoice != bill) {
        arr.push(invoice);
      }
    }
    this.isSelect = arr;
  }
  async readParameter() {
    this.parameter.numfactimp = await this.numFac();
    this.parameter.numfactele = await this.numFacTele();
    this.parameter.copias = await this.copias();
  }

  async numFac() {
    const filter = new ListParams();
    filter['filter.parameter'] = `${SearchFilter.EQ}:NUMFACTIMP`;
    filter['filter.addres'] = `${SearchFilter.EQ}:M`;
    return firstValueFrom(
      this.parameterModService.getAll(filter).pipe(
        map(resp => Number(resp.data[0].value)),
        catchError(() => of(1))
      )
    );
  }

  async numFacTele() {
    const filter = new ListParams();
    filter['filter.parameter'] = `${SearchFilter.EQ}:NUMFACTELEC`;
    filter['filter.addres'] = `${SearchFilter.EQ}:M`;
    return firstValueFrom(
      this.parameterModService.getAll(filter).pipe(
        map(resp => Number(resp.data[0].value)),
        catchError(() => of(1))
      )
    );
  }
  async copias() {
    const filter = new ListParams();
    filter['filter.parameter'] = `${SearchFilter.EQ}:NOCOPIASFACT`;
    filter['filter.addres'] = `${SearchFilter.EQ}:M`;
    return firstValueFrom(
      this.parameterModService.getAll(filter).pipe(
        map(resp => Number(resp.data[0].value)),
        catchError(() => of(1))
      )
    );
  }

  clientSend() {
    this.alertQuestion(
      'question',
      'Se enviará el nuevo CFDI para Atención a Clientes',
      '¿Desea continuar?'
    ).then(async answer => {
      if (answer.isConfirmed) {
        // PUP_INICIALIZA_BATS;
        await this.impresioPackage();
        this.alert('success', 'El CFDI nuevo fue enviado', '');
      }
    });
  }

  async impresioPackage() {
    let v_uuid: number;
    let result = this.isSelect.map(async invoice => {
      if (
        [2, 5].includes(Number(invoice.Type)) &&
        (invoice.exhibit ?? 'S') == 'S'
      ) {
        v_uuid = 0;

        v_uuid = await this.getBill(invoice);

        if (['CFDI', 'IMP'].includes(invoice.factstatusId) && v_uuid == 1) {
          //'PUP_REP_FACTURA_MAS 10','A'
          await this.pupRepBillMore(10, invoice.Type, invoice);
          //'PUP_REP_FACTURA_MAS 11','A'
          await this.pupRepBillMore(11, invoice.Type, invoice); // CONSTANCIA DE ENTREGA Y CFDI
        } else {
          this.alert(
            'warning',
            `El lote ${invoice.batchId} no tiene estatus IMP o CFDI no se podrá imprimir el paquete`,
            ''
          );
        }
      } else {
        // pup_rep_factura_mas
        await this.pupRepBillMore(11, invoice.Type, invoice);
      }
    });

    Promise.all(result).then(resp => {
      //llama PUP_EJECUTA_BATS
      this.isSelect = [];
      this.dataFilter.refresh();
      this.pupEjecutaBats();
      return true;
    });
  }
  pupEjecutaBats() {}
  async getBill(invoice: any) {
    const filter = new FilterParams();

    filter.addFilter('billId', invoice.billId, SearchFilter.EQ);
    filter.addFilter('eventId', invoice.eventId, SearchFilter.EQ);
    filter.addFilter('batchId', invoice.batchId, SearchFilter.EQ);
    filter.addFilter('uuid', 'null', SearchFilter.NOT);

    return firstValueFrom(
      this.comerEleBillService.getAll(filter.getParams()).pipe(
        map(() => 1),
        catchError(() => of(0))
      )
    );
  }

  cancelInvoice() {
    this.form.get('userV').patchValue(null);
    this.form.get('passwordV').patchValue(null);
    let count: number = 0;
    // START PUP_VAL_ESTATUS //
    if (this.isSelect.length == 0)
      return this.alert(
        'warning',
        'Debe seleccionar facturas para cancelar',
        ''
      );

    for (const invoice of this.isSelect) {
      if (!['CFDI', 'IMP'].includes(invoice.factstatusId)) {
        count++;
      }
    }

    if (count == 1) {
      this.alert(
        'warning',
        'La factura no tiene un estatus válido para cancelación',
        ''
      );
      return;
    } else if (count > 1) {
      this.alert(
        'warning',
        `La selección contiene ${count} facturas que no tienen un estatus válido para cancelación`,
        ``
      );
      return;
    }
    // END PUP_VAL_ESTATUS //
    this.validateCancel();
  }

  async validateCancel() {
    // -- PRIMERO VALIDAMOS CAUSA Y FOLIO SP
    const { causerebillId, folio, refactura } = this.form.value;
    if (!causerebillId) {
      this.isVisibleField(1);
    } else if (causerebillId) {
      if (this.isSelect[0].factstatusId == 'CAN') {
        this.alert('warning', 'No puede procesar una factura cancelada', '');
        this.isVisibleField(0);
        return;
      }
      if (!folio && refactura == 'P') {
        this.alert('warning', 'Introduzca la Solicitud de Pago', '');
        return;
      } else if (folio && refactura == 'P') {
        const puf_valid = await this.validaFolSp(this.isSelect[0].eventId);
        if (puf_valid == 0) {
          this.alert(
            'warning',
            'El folio de la solicitud de pago no corresponden a la factura',
            'Favor de verificar'
          );
          return;
        } else if (puf_valid == 1) {
          this.alert(
            'warning',
            'Los montos de la solicitud de pago no corresponden a la factura',
            'Favor de verificar'
          );
          return;
        } else {
          if (this.isSelect[0].factstatusId == 'CAN') {
            this.alert(
              'warning',
              'No puede procesar una factura cancelada',
              ''
            );
            this.isVisibleField(0);
            return;
          } else {
            // PUP_FACTURASXIDGASTO
            await this.pup_invoice();
          }
        }
      }

      // --------------- Completado -------------- //
      let config: ModalOptions = {
        initialState: {
          form: this.form,
          data: this.isSelect,
          global: this.global,
          parameter: this.parameter,
          callback: async (
            data: { eventId: any; factstatusId: any },
            val: number,
            GO_BLOCK: boolean
          ) => {
            if (data) {
              if (data.factstatusId)
                this.paramsList.getValue()[
                  'filter.factstatusId'
                ] = `${SearchFilter.NOT}:${data.factstatusId}`;
              this.paramsList.getValue()[
                'filter.eventId'
              ] = `${SearchFilter.EQ}:${data.eventId}`;
              await this.forArrayFilters('eventId', data.eventId);
              this.getAllComer();
            }
            if (GO_BLOCK) {
              const { folio } = this.form.value;
              const idpayment = await this.checkIdGasto(
                folio,
                this.isSelect[0].eventId
              );
              let config = {
                initialState: {
                  eventId: this.isSelect[0].eventId,
                  idpayment,
                  val: true,
                  form: this.form,
                  callback: async (
                    data: { eventId: any; factstatusId: any },
                    val: number,
                    GO_BLOCK: boolean
                  ) => {
                    if (data) {
                      if (data.factstatusId) {
                        this.paramsList.getValue()[
                          'filter.factstatusId'
                        ] = `${SearchFilter.NOT}:${data.factstatusId}`;
                      }

                      this.paramsList.getValue()[
                        'filter.eventId'
                      ] = `${SearchFilter.EQ}:${data.eventId}`;
                      await this.forArrayFilters('eventId', data.eventId);
                      this.getAllComer();
                    }
                  },
                },
                class: 'modal-lg modal-dialog-centered',
                ignoreBackdropClick: true,
              };
              this.modalService.show(FactCanceladasComponent, config);
            }
            this.isVisibleField(val);
          },
        },
        class: 'modal-md modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(AuthorizationModalComponent, config);
    }
  }

  async pup_invoice() {
    const { folio } = this.form.value;
    const idpayment = await this.checkIdGasto(folio, this.isSelect[0].eventId);

    if (idpayment) {
      this.global.canxp = 'S';
      this.global.pidgasto = idpayment;
      let config = {
        initialState: {
          eventId: this.isSelect[0].eventId,
          idpayment,
          val: false,
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(FactCanceladasComponent, config);
    } else {
      this.global.canxp = 'N';
    }
  }

  async checkIdGasto(idSol: number, idEvent: number) {
    const filter = new FilterParams();
    filter.addFilter('paymentRequestNumber', idSol, SearchFilter.EQ);
    filter.addFilter('eventNumber', idEvent, SearchFilter.EQ);
    return firstValueFrom(
      this.comerSpenService.getAll(filter.getParams()).pipe(
        map(resp => resp.data[0].expenseNumber),
        catchError(() => of(null))
      )
    );
  }

  async getData(event: number, expend: number) {
    return firstValueFrom(
      this.comerInvoice.getEats(event, expend).pipe(
        map(resp => resp.data),
        catchError(() => of([]))
      )
    );
  }

  isVisibleField(option: number) {
    if (option == 1) {
      this.isCancel = true;
    } else if (option == 0) {
      this.isCancel = false;
      this.form.get('causerebillId').patchValue(null);
      this.form.get('folio').patchValue(null);
    }
  }

  async validaFolSp(event: number) {
    const { folio } = this.form.value;
    return firstValueFrom(
      this.comerInvoice.pufValidaInvoiceSP(event, folio).pipe(
        map(resp => resp.lv_valdida),
        catchError(() => of(0))
      )
    );
  }

  setDataCause(data: any) {
    this.form.get('refactura').patchValue(data.rebill);
  }

  // EXPORTAR A EXCEL --- Falta optimizar -- //
  async exportData() {
    const data: any[] = await this.dataFilter.getAll();

    if (data.length == 0) {
      this.alert('warning', 'Debe consultar un evento', '');
      return;
    }

    if (this.isSelect.length == 0) {
      this.alert('warning', 'Debe seleccionar facturas a exportar', '');
      return;
    }

    this.btnLoading13 = true;
    await this.markProcess('EX', null);
    //update los seleccionados
    this.comerInvoice.exportExcell(data[0].eventId).subscribe({
      next: resp => {
        const linkSource = `data:application/xlsx;base64,${resp.resultExcel.base64File}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = linkSource;
        downloadLink.download = 'facturas' + '.xlsx';
        downloadLink.target = '_blank';
        downloadLink.click();
        downloadLink.remove();
        this.btnLoading13 = false;
        this.alert('success', 'Archivo descargado correctamente', '');
      },
      error: error => {
        this.btnLoading13 = false;
        this.alert('warning', error.error.message, '');
      },
    });
  }

  async markProcess(process: string, statusValid: string) {
    let aux_valgasto: number;
    let aux_val_liq: number;
    let cont: number = 0;
    let contg: number = 0;
    let aux_status: string;
    if (!statusValid) {
      aux_status = null;
    } else {
      aux_status = statusValid;
    }
    let arr = [];
    for (const invoice of this.isSelect) {
      if (invoice.factstatusId == (aux_status ?? invoice.factstatusId)) {
        if (!invoice.billRelimagId && !invoice.eventRelimagId) {
          aux_valgasto = await this.subTotalPrice(
            invoice.eventId,
            invoice.batchId
          );
          if (aux_valgasto == 0) {
            aux_val_liq = await this.batchLiq(invoice.eventId, invoice.batchId);
            if (aux_val_liq == 1) {
              invoice.process = process;
              let obj = {
                process: process,
                eventId: invoice.eventId,
                billId: invoice.billId,
              };
              arr.push(obj);
            } else {
              cont++;
            }
          } else if (aux_valgasto >= 1) {
            contg++;
          }
        } else {
          invoice.process = process;
          let obj = {
            process: process,
            eventId: invoice.eventId,
            billId: invoice.billId,
          };
          arr.push(obj);
        }
      }
    }

    if (cont == 1 && aux_val_liq == 0) {
      this.alert(
        'warning',
        'No se generara el folio de la factura',
        `El lote ${
          this.isSelect[this.isSelect.length - 1].batchId
        } no ha sido afectado`
      );
    } else if (cont > 1 && aux_val_liq == 0) {
      this.alert(
        'warning',
        `${cont} facturas no pueden ser foliadas`,
        `Sus lotes no han sido afectados`
      );
    } else {
      let resp = await this.putApplicationPutProcess(arr);
      // console.log("NICE", resp)
      return resp;
    }

    if (contg == 1 && aux_valgasto == 1) {
      this.alert(
        'warning',
        'No se generará el folio de la factura',
        `El lote ${
          this.isSelect[this.isSelect.length - 1].batchId
        } no cumple las validaciones de los montos(chatarra)`
      );
    } else if (cont > 1 && aux_val_liq > 1) {
      this.alert(
        'warning',
        `${contg} facturas no pueden ser foliadas`,
        `No cumplen las validaciones de los montos(chatarra)`
      );
    }

    return true;
  }

  async viewInvoice() {
    if (this.isSelect.length == 0) {
      this.alert('warning', 'Debe seleccionar algún evento', '');
      return;
    }
    // LLAMA_REPORTE (:COMER_FACTURAS.TIPO, 2, NULL, 1);
    this.callReport(
      Number(this.isSelect[0].Type),
      2,
      null,
      1,
      this.isSelect[0].eventId,
      this.isSelect[0].billId,
      this.isSelect[0].impressionDate
    );
    this.desSelectOne(this.isSelect[0]);
    // this.isSelect = [];
    this.dataFilter.refresh();
  }

  async viewAnexo() {
    if (this.isSelect.length == 0) {
      this.alert('warning', 'Debe seleccionar algún evento', '');
      return;
    }
    this.btnLoading14 = true;
    const date = await this.getDateParameter();

    const val = await this.etapaNexo(this.isSelect[0].impressionDate);

    if (val == 1) {
      for (const inv of this.isSelect) {
        if (inv.exhibit == 'S' && [2, 5].includes(Number(inv.Type))) {
          this.callReport(
            10,
            2,
            null,
            1,
            this.isSelect[0].eventId,
            this.isSelect[0].billId,
            this.isSelect[0].impressionDate
          );
          this.btnLoading14 = false;
        } else {
          this.btnLoading14 = false;
          this.alert('warning', 'La factura no tiene anexo', '');
        }
        break;
      }
    } else {
      this.btnLoading14 = false;
      this.alert(
        'warning',
        'No se puede visualizar el anexo',
        `La fecha de impresión es nula o es mayor al ${this.datePipe.transform(
          date,
          'dd/MM/yyyy'
        )}`
      );
    }
  }

  async getDateParameter() {
    const filter = new FilterParams();
    filter.addFilter('id', 'PLEANEXO', SearchFilter.EQ);
    return firstValueFrom(
      this.parameterGoodService.getAllWithFilters(filter.getParams()).pipe(
        map(resp => resp.data[0].startDate),
        catchError(() => of(null))
      )
    );
  }

  async allSelect() {
    this.btnLoading8 = true;
    const user = this.authService.decodeToken().preferred_username;
    const userValid = await this.validUser('LGONZALEZG' ?? user);
    const data = await this.dataFilter.getAll();
    const { date } = this.form.value;

    if (userValid == 0) {
      this.alert(
        'warning',
        'No cuenta con los permisos para realizar esta operación',
        ''
      );
      this.btnLoading8 = false;
    } else {
      if (data.length == 0) {
        this.btnLoading8 = false;
        this.alert('warning', 'Debe consultar un evento', '');
        return;
      }
      if (date) {
        // saveData.hourAttention = this.datePipe.transform(
        //   saveData.hourAttention,
        //   'yyyy-MM-dd HH:mm:ss'
        // );
        const newDate = this.datePipe.transform(date, 'yyyy-MM-dd');
        const data = await this.dataFilter.getAll();
        let exist: boolean = false;
        for (const invoice of data) {
          if (!invoice.impressionDate) {
            invoice.impressionDate = newDate;
            exist = true;
          }
        }
        this.dataFilter.load([...data]);
        this.dataFilter.refresh();
        if (exist) {
          const params = {
            ...this.paramsList.getValue(),
            ...this.columnFilters,
          };
          this.comerInvoice
            .updateEventByDate(params, { impressionDate: newDate })
            .subscribe({
              next: () => {
                this.alert(
                  'success',
                  'La fecha de impresión ha sido actualizada',
                  ''
                );
              },
            });
          this.btnLoading8 = false;
        } else {
          this.btnLoading8 = false;
          this.alert(
            'warning',
            'No hay fechas de impresión para actualizar',
            ''
          );
        }

        this.form.get('date').patchValue(null);
      } else {
        this.selectAllInvoice(userValid);
        this.btnLoading8 = false;
      }
    }
  }

  async selectAllInvoice(user: number) {
    const { delegation } = this.form.value;
    const reg = Number(this.authService.decodeToken().department);
    const data = await this.dataFilter.getAll();

    if (user == 2) {
      for (const invoice of data) {
        if (Number(invoice.delegationNumber) == reg) {
          const index = this.isSelect.findIndex(
            comer =>
              comer.eventId == invoice.eventId && comer.billId == invoice.billId
          );
          if (index == -1) this.isSelect.push(invoice);
          if (index > -1) this.isSelect.splice(index, 1);
        }
      }
    } else if (user == 1) {
      for (const invoice of data) {
        if (
          Number(invoice.delegationNumber) ==
          (delegation ?? Number(invoice.delegationNumber))
        ) {
          const index = this.isSelect.findIndex(
            comer =>
              comer.eventId == invoice.eventId && comer.billId == invoice.billId
          );
          if (index == -1) this.isSelect.push(invoice);
          if (index > -1) this.isSelect.splice(index, 1);
        }
      }
      this.dataFilter.add(data);
      this.dataFilter.refresh();
    }
  }

  async invoiceSP() {
    const { causerebillId } = this.form.value;
    let ban: boolean = false;
    let vid_lote: number;

    if (causerebillId == 41 || causerebillId == 141) {
      vid_lote = null;
      ban = true;

      for (const invoice of this.isSelect) {
        if (vid_lote) break;
        vid_lote = invoice.batchId;
      }

      const folio = await this.maxPay(this.isSelect[0].eventId, vid_lote);
      this.form.get('folio').patchValue(folio);
    } else {
      this.form.get('folio').patchValue(null);
    }
  }

  async maxPay(event: number, batchId: number) {
    return firstValueFrom(
      this.comerInvoice.maxPayment(event, batchId).pipe(
        map(resp => resp.folio_sp),
        catchError(() => of(null))
      )
    );
  }

  CancelInvoice() {
    this.parameter.autorizo = 0;
    this.isVisibleField(0);
  }

  optXLote: any;
  valSortBy: boolean = false;
  changeOpt(event: any) {
    if (event == 1) this.paramsList.getValue()['sortBy'] = `batchId:DESC`;
    if (event == 2)
      this.paramsList.getValue()['sortBy'] = `delegationNumber:DESC`;
    if (event == 4) this.paramsList.getValue()['sortBy'] = `Invoice:DESC`;

    this.valSortBy = true;
    if (!event) this.valSortBy = false;

    this.optXLote = this.paramsList.getValue()['filter.batchId'];
    console.log('this.xLote.value', this.xLote.value);
    if (!this.xLote.value) {
      if (this.paramsList.getValue()['filter.batchId'])
        delete this.paramsList.getValue()['filter.batchId'];
    } else {
      if (this.optXLote)
        this.paramsList.getValue()['filter.batchId'] = `$eq:${this.optXLote}`;
    }
    if (!this.paramsList.getValue()['filter.eventId']) return;

    this.getAllComer();
  }

  async printerMasivePDF() {
    if (this.isSelect.length == 0)
      return this.alert('warning', 'Debe seleccionar una factura', '');
    this.path = '';
    let L_PATH = '';
    let L_FILE: any;
    let VC_FILTRO = 'Todos (*.*) |*.*|';
    this.btnLoading1 = true;
    this.path = L_PATH;
    // IMPRIMIR_FACTURA_2
    await this.printerBill2();
  }

  GET_PATH_NAME(L_FILE): string {
    return '';
  }

  async printerBill2() {
    // IMPRIMIR_FACTURA_2
    if (this.isSelect.length == 0)
      return this.alert('warning', 'Debe seleccionar una factura', '');

    let NUM_REG: number;
    let NUM_DAT: number;
    let POS_REG: number;
    let aux: number;
    let J: number;
    if (NUM_REG < 6 && NUM_DAT > 6) {
      // -- SI LA POSICION ES MENOR A 6 Y A MAS DE 6 REGISTROS
      POS_REG = 1;
    } else {
      POS_REG = NUM_REG - 6;
      if (POS_REG < 0) {
        POS_REG = 1;
      }
    }
    aux = 1;
    if (aux == 1) {
      for (const invoice of this.isSelect) {
        J = J + 1;
        // PUP_REP_FACTURA_MAS
        await this.pupRepBillMore(0, invoice.Type, invoice);
        // break;
      }
    }
    this.btnLoading1 = false;
    this.alert('success', 'Proceso terminado', '');
  }

  async pupRepBillMore(P_TIPOA: number, psubtipo: number, invoice: any) {
    let data_: IPupRepBillMore = {
      pTypeA: P_TIPOA,
      pSubType: psubtipo,
      type: invoice.Type,
      eventId: invoice.eventId,
      lotId: invoice.batchId,
      billId: invoice.billId,
      statusFactId: invoice.factstatusId,
      impressionDate: invoice.impressionDate,
      typeVoucher: invoice.vouchertype,
      series: invoice.series,
      invoice: invoice.Invoice,
      tpEvent: invoice.tpevent,
      delegationNumber: Number(invoice.delegationNumber),
    };

    let result = await this.servicePupRepBillMore(data_);
    console.log('result', result);
    return result;
  }
  servicePupRepBillMore(data: IPupRepBillMore) {
    return new Promise((resolve, reject) => {
      this.fileBrowserService.pupRepBillFurtherFurniture(data).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  pupSaveFile(P_RUTA: string, P_EVENTO: any, P_LOTE: any) {
    // PUP_GUARDA_ARCHIVO
  }

  pupSendVD(P_RUTA: string, P_EVENTO: any, P_LOTE: any) {
    // PUP_ENVIAR_VD
  }

  pupSendATC(P_RUTA: string, P_EVENTO: any, P_LOTE: any) {
    // PUP_ENVIAR_ATC
  }

  selectDataDet: any = null;
  selectDataComerDetInvocie(data: any) {
    this.selectDataDet = data;
  }

  async updateDetFact(option: string) {
    if (!this.rowInvoice)
      return this.alert('warning', 'No ha seleccionado Factura', '');

    if (!this.selectDataDet)
      return this.alert('warning', 'No ha seleccionado Detalle de Factura', '');

    if (this.rowInvoice.factstatusId == 'PREF') {
      let result: any = false;
      if (option == 'AP') {
        // AP
        this.btnLoadAP = true;
        let body = {
          detinvoiceId: this.selectDataDet.detinvoiceId,
          eventId: this.selectDataDet.eventId,
          batchId: this.selectDataDet.batchId,
          billId: this.selectDataDet.billId,
          prodservSatKey: this.selectDataDet.prodservSatKey,
        };
        result = await this.billingsService.updateDetBillings(body);
      } else if (option == 'AU') {
        this.btnLoadAU = true;
        let body = {
          detinvoiceId: this.selectDataDet.detinvoiceId,
          eventId: this.selectDataDet.eventId,
          batchId: this.selectDataDet.batchId,
          billId: this.selectDataDet.billId,
          unitSatKey: this.selectDataDet.unitSatKey,
        };
        result = await this.billingsService.updateDetBillings(body);
      }

      if (!result) {
        this.alert('warning', 'No se pudo actualizar el registro', '');
        this.btnLoadAP = false;
        this.btnLoadAU = false;
      } else {
        this.alert('success', 'Se actualizó el registro correctamente', '');
        this.getComerDetInovice();
        this.btnLoadAP = false;
        this.btnLoadAU = false;
      }
      this.selectDataDet = null;
    } else {
      this.alert(
        'warning',
        'Estatus de la factura inválida para realizar el cambio.',
        ''
      );
    }
  }

  async forArrayFilters(field: any, value: any) {
    const subheaderFields: any = this.table.grid.source;

    const filterConf = subheaderFields.filterConf;
    if (filterConf.filters.length > 0) {
      filterConf.filters.forEach((item: any) => {
        if (item.field == field) {
          item.search = value;
        }
      });
    }
    this.dataFilter.refresh();
    return true;
  }

  async forArrayFilters_() {
    const subheaderFields: any = this.table.grid.source;

    const filterConf = subheaderFields.filterConf;
    let val = true;
    if (filterConf.filters.length > 0) {
      filterConf.filters.forEach((item: any) => {
        if (item.search != '') {
          val = false;
        }
      });
    }
    return val;
  }
}

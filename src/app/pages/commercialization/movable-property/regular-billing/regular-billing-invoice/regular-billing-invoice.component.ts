import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import { CustomFilterComponent } from 'src/app/@standalone/shared-forms/input-number/input-number';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { InvoiceFolioSeparate } from 'src/app/core/models/ms-invoicefolio/invoicefolio.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { ComerDetailInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-dinvocie.service';
import { ComerElecBillService } from 'src/app/core/services/ms-invoice/ms-comer-elec-bill.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { ParameterInvoiceService } from 'src/app/core/services/ms-parameterinvoice/parameterinvoice.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FolioModalComponent } from '../../../penalty-billing/folio-modal/folio-modal.component';
import { AuthorizationModalComponent } from './authorization-modal/authorization-modal.component';
import { REGULAR_GOODS_COLUMN } from './regular-billing-invoice-goods-columns';

@Component({
  selector: 'app-regular-billing-invoice',
  templateUrl: './regular-billing-invoice.component.html',
  styles: [],
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
  };
  blk_actdat: any[] = [];
  limit: FormControl = new FormControl(500);

  @Output() comer: EventEmitter<any> = new EventEmitter(null);
  @Output() formG: EventEmitter<FormGroup> = new EventEmitter();
  @Input() set sum(values: any) {
    if (values) {
      // const time = setTimeout(() => {
      //   this.formFactura.get('importE').patchValue(values.sum5);
      //   this.formFactura.get('ivaE').patchValue(values.sum3);
      //   this.formFactura.get('totalE').patchValue(values.sum1);
      //   this.formFactura.get('importI').patchValue(values.sum6);
      //   this.formFactura.get('ivaI').patchValue(values.sum4);
      //   this.formFactura.get('totalI').patchValue(values.sum2);
      //   clearTimeout(time);
      // }, 0);
    }
  }

  val: any;

  get sum() {
    return this.val;
  }

  get idAllotment() {
    return this.form.get('idAllotment');
  }

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
    private parameterGoodService: ParameterCatService
  ) {
    super();

    this.settings2.columns = { ...REGULAR_GOODS_COLUMN };
    this.settings2.hideSubHeader = false;

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
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
                (instance.box.nativeElement as HTMLInputElement).click();
              }
              clearTimeout(time);
            }, 300);
            instance.toggle.subscribe((data: any) => {
              console.log(data.toggle);

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
          filter: {
            type: 'custom',
            component: CustomFilterComponent,
          },
        },
        batchId: {
          title: 'Lote',
          sort: false,
          filter: {
            type: 'custom',
            component: CustomFilterComponent,
          },
        },
        customer: {
          title: 'Cliente',
          sort: false,
        },
        delegationNumber: {
          title: 'Regional',
          sort: false,
          filter: {
            type: 'custom',
            component: CustomFilterComponent,
          },
        },
        Type: {
          title: 'Factura Para',
          sort: false,
          valuePrepareFunction: (val: number) => {
            const values = [
              { id: 1, desc: 'Vehículo' },
              { id: 2, desc: 'Diversos c/Anexo' },
              { id: 3, desc: 'Diversos s/Anexo' },
              { id: 4, desc: 'Aeronaves' },
              { id: 5, desc: 'Chatarra c/Anexo' },
              { id: 6, desc: 'Chatarra s/Anexo' },
              { id: 7, desc: 'Venta de Bases' },
            ];
            return values.filter(m => m.id == val)[0]?.desc ?? '';
          },
        },
        series: {
          title: 'Serie',
          sort: false,
        },
        folioinvoiceId: {
          title: 'Folio',
          sort: false,
          filter: {
            type: 'custom',
            component: CustomFilterComponent,
          },
        },
        factstatusId: {
          title: 'Estatus',
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
            return val ? val.split('-').reverse().join('/') : '';
          },
        },
      },
    };
  }

  ngOnInit(): void {
    this.paramsList.getValue().limit = 500;
    this.paramsList2.getValue().limit = 500;
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
              folioinvoiceId: () => (searchFilter = SearchFilter.EQ),
              factstatusId: () => (searchFilter = SearchFilter.ILIKE),
              vouchertype: () => (searchFilter = SearchFilter.ILIKE),
              impressionDate: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getAllComer();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems > 0) this.getAllComer();
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

  getComerDetInvocie(data: any) {
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
      // ...{ sortBy: 'batchId:ASC' },
    };

    this.loading2 = true;
    this.comerDetInvoice.getAllCustom(params).subscribe({
      next: async (resp: any) => {
        this.loading2 = false;
        this.formDetalle.get('count').patchValue(resp.count);
        this.formDetalle.get('totalI').patchValue(resp.data[0].sum.importe);
        this.formDetalle.get('totalIva').patchValue(resp.data[0].sum.iva);
        this.formDetalle.get('total').patchValue(resp.data[0].sum.total);
        this.formDetalle.get('countTotal').patchValue(resp.data[0].sum.amount);
        this.totalItems2 = resp.count;
        this.dataFilter2.load(resp.data[0].result);
        this.dataFilter2.refresh();
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

  getAllComer() {
    const params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
      //...{ sortBy: 'batchId:ASC' },
    };

    this.loading = true;
    this.comerInvoice.getAllSumInvoice(params).subscribe({
      next: resp => {
        this.loading = false;
        this.formFactura.get('count').patchValue(resp.count);
        this.totalItems = resp.count;
        this.dataFilter.load(resp.data);
        this.dataFilter.refresh();
        this.paramsList2.getValue()[
          'filter.eventId'
        ] = `${SearchFilter.EQ}:${resp.data[0].eventId}`;
        this.paramsList2.getValue()[
          'filter.billId'
        ] = `${SearchFilter.EQ}:${resp.data[0].billId}`;
        this.getComerDetInovice();
        this.getSum();
        this.comer.emit({
          val: resp.data[0].eventId,
          count: resp.data.length,
          data: [],
          filter: params,
        });
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
      this.alert(
        'warning',
        'Atención',
        'Ingrese un evento para generar prefacturas'
      );
      return;
    }

    const count = await this.getCountBatch(event, idAllotment);

    if (count == 0) {
      this.alert(
        'warning',
        'Atención',
        'No se encontraron Lotes con estatus válidos para facturar'
      );
      return;
    }

    const valid = await this.getValidBatch(event, idAllotment);

    if (valid.cont_nofact > 0) {
      this.alert(
        'warning',
        'Atención',
        `No se generan ${valid.cont_nofact} factura(s) por Mandatos no facturables.`
      );
    }

    if (valid.contador == 0) {
      this.alert(
        'warning',
        'Atención',
        'No se encontraron Lotes para facturar'
      );
      return;
    }

    this.alertQuestion(
      'warning',
      `Se generarán ${valid.contador} factura(s)`,
      '¿Desea continuar?'
    ).then(async ans => {
      if (ans.isConfirmed) {
        //en espera de revision de creacion facturas e inconsitencias
        const pk_comer = await this.packageInvoice({
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

        console.log(pk_comer);
      } else {
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

  updateData() {
    let l_ban: boolean = false;
    this.blk_actdat = [];
    if (this.isSelect.length == 0) {
      this.alert('warning', 'Atención', 'Debe seleccionar alguna Factura');
      return;
    }

    for (const invoice of this.isSelect) {
      l_ban = true;

      if (this.blk_actdat[0].eventId) {
        for (const act of this.blk_actdat) {
          //dudas en datos
        }
      }
    }
  }

  async generateInvoice() {
    const user = this.authService.decodeToken();
    const userValid = await this.validUser(user.preferred_username);
    let n_cont: number;
    let c_ind: string;
    let n_id_event: number;
    const { event, idAllotment } = this.form.value;

    if (userValid == 0) {
      this.alert(
        'warning',
        'Atención',
        'No cuenta con permisos para efectuar esta operación'
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
          this.alertInfo('warning', 'Atención', 'Sin factura(s) para trabajar');
          return;
        }

        for (const invoice of this.isSelect) {
          if (!n_id_event) {
            n_id_event = invoice.eventId;
          }
          if (invoice.factstatusId == 'PREF') {
            n_cont++;
          }
        }
      }

      if (n_cont == 0) {
        this.alert(
          'warning',
          'Atención',
          'Sin prefacturas para asignar folios'
        );
        return;
      }

      this.alertQuestion(
        'warning',
        `Se asignarán ${n_cont} folio(s)`,
        '¿Desea continuar?'
      ).then(ans => {
        if (ans.isConfirmed) {
          this.newGenerateInvoice(c_ind, n_id_event);
        }
      });
    }
  }

  async newGenerateInvoice(c_ind: string, n_id_event: number) {
    let departament = this.authService.decodeToken().department;
    let c_indN = c_ind;
    let event = n_id_event;

    const tp_event = await this.getIdTpEvent(event);

    const valid = await this.validaFolAvaliable(
      String(n_id_event),
      this.isSelect[0]?.tpevent ?? tp_event
    );

    if (valid == 1) {
      await this.updateDoc(n_id_event);

      await this.newMarkProcess('EL', 'PREF', c_indN);

      //commit guardar cambios

      await this.generateInvoiceCtrl(String(event), tp_event);

      if (c_indN == 'F') {
        this.paramsList = new BehaviorSubject<ListParams>(new ListParams());
        this.paramsList.getValue()[
          'filter.eventId'
        ] = `${SearchFilter.EQ}:${event}`;
        this.paramsList.getValue()['filter.address'] = `${SearchFilter.EQ}:M`;
        this.getAllComer();
      }

      //procedimiento verifica prov cance
      this.verifyProv();
    } else {
      this.alert('warning', 'Atención', 'No existen folios disponibles');
    }
  }

  async verifyProv() {
    const data = await this.dataFilter.getAll();
    for (const invoice of data) {
      if (
        invoice.archImgtemp &&
        invoice.billId &&
        invoice.factstatusId != 'CAN'
      ) {
        invoice.factstatusId = 'FOL';
        //hacer update
      }
    }
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
            } else {
              cont++;
            }
          } else if (aux_valgasto >= 1) {
            contg++;
          }
        } else {
          invoice.process = process;
        }
      }

      if (cont == 1 && aux_val_liq == 0) {
        this.alert(
          'warning',
          'Atención',
          `No se generara el folio de la factura. El lote ${
            this.isSelect[this.isSelect.length - 1].batchId
          } no ha sido afectado`
        );
      } else if (cont > 1 && aux_val_liq == 0) {
        this.alert(
          'warning',
          'Atención',
          `${cont} facturas no pueden ser foliadas, sus lotes no han sido afectados`
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
      this.alert('warning', 'Atención', 'Debe seleccionar un evento');
      return;
    }

    let aux = 0;

    aux = this.validateRemoveInvoice();

    if (aux == 1) {
      await this.markProcess('EF', 'FOL');
      //update seleccionados
    }

    this.comerInvoice
      .deleteFolio({ eventId: data[0].eventId, invoiceId: null })
      .subscribe({
        next: () => {
          this.alert('success', 'Folios', 'Eliminados Correctamente');

          // this.comerInvoice.update(this.billingForm.value).subscribe({
          //   next: () => {
          //     this.getAllComer()
          //   },
          //   error: err => {
          //     this.alert('error', 'Error', err.error.message);
          //   },
          // });
        },
        error: err => {
          this.alert('error', 'Error', err.error.message);
        },
      });
  }

  validateRemoveInvoice(): number {
    for (const invoice of this.isSelect) {
      if (invoice.factstatusId != 'FOL') {
        this.alert(
          'warning',
          'Atención',
          'Soló se puede eliminar folios de facturas con estatus FOL, si lo desea puede cancelarla'
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
      passwordV: [null, Validators.required],
      folio: [null],
      refactura: [null],
    });

    this.formFactura = this.fb.group({
      importE: [null],
      ivaE: [null],
      totalE: [null],
      count: [null],
      importI: [null],
      ivaI: [null],
      totalI: [null],
    });

    this.formDetalle = this.fb.group({
      count: [null],
      totalI: [0],
      totalIva: [0],
      total: [0],
      countTotal: [null],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  disabledButtons() {
    const { check } = this.form.value;
    this.buttons = check;
  }

  exportAsXLSX(): void {
    //this.excelService.exportAsExcelFile(this.data, 'facturas_de_eventos');
  }

  delete() {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
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
    let config: ModalOptions = {
      initialState: {
        callback: async (next: boolean, data: InvoiceFolioSeparate) => {
          if (next) {
            const invoice: any[] = await this.dataFilter.getAll();
            const index = invoice.findIndex(inv => inv == this.isSelect[0]);
            invoice[index].series = data.series;
            invoice[index].folioinvoiceId = data.folioinvoiceId;
            invoice[index].Invoice = data.invoice;
            invoice[index].factstatusId = 'FOL';
            this.dataFilter.load(invoice);
            this.dataFilter.refresh();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(FolioModalComponent, config);
  }

  track() {
    const desc = this.isSelect.length > 0 ? this.isSelect[0].declassify : null;
    if (this.selectInovice() == 1 && desc == 'S') {
      this.alert(
        'warning',
        'Atención',
        'Esta Bien ya se encuentra como tractocamión sin placas federales'
      );
      this.removeSelect();
    } else if (this.selectInovice() == 1 && !desc) {
      //hacer una actualizacion del invoice
      const invoice = this.isSelect[0];
      invoice.declassify = 'S';
      delete invoice.invoiceStatusId;
      delete invoice.usoComp;
      delete invoice.unite;
      delete invoice.prod;
      delete invoice.payment;
      delete invoice.relation;
      delete invoice.totaleg;
      delete invoice.totaling;
      delete invoice.ivaeg;
      delete invoice.ivaing;
      delete invoice.precioing;
      delete invoice.precioeg;
      delete invoice.regional;

      this.comerInvoice.update(this.isSelect[0]).subscribe({
        next: () => {
          this.getAllComer();
        },
        error: () => {},
      });
      this.removeSelect();
    }
  }

  selectInovice(): number {
    return this.isSelect.length > 0 ? 1 : 0;
  }

  async removeSelect() {
    const data: any[] = await this.dataFilter.getAll();
    const event = data.length > 0 ? data[0].eventId : null;

    if (!event) {
      this.alert('warning', 'Atención', 'Debe consultar un evento');
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
    const data = {
      PEVENTO: eventId,
      PFACTURA: factura,
    };
    if (pTipo == 1) {
      if (count > 0) {
        this.getReport('RCOMERFACTURAS_VEH_VNR', data);
      } else {
        this.getReport('RCOMERFACTURAS_VEH', data);
      }
    } else if (pTipo == 2) {
      const v_val = await this.etapaNexo(impressionDate);
      if (v_val == 1) {
        this.getReport('RCOMERFACTURAS_DIVERSOS', data);
      } else if (v_val == 2) {
        this.getReport('RCOMERFAC_GRALSNANX', data);
      } else {
        this.alert('warning', 'Atención', 'No se puede visualizar el reporte');
      }
    } else if (pTipo == 3) {
      if (count > 0) {
        this.getReport('RCOMERFACTURAS_DIV_SA_VNR', data);
      } else {
        this.getReport('RCOMERFACTURAS_DIVSANEXO', data);
      }
    } else if (pTipo == 4) {
      if (count > 0) {
        this.getReport('RCOMERFACTURAS_AERONAVE_VNR', data);
      } else {
        this.getReport('RCOMERFACTURAS_AERONAVE', data);
      }
    } else if (pTipo == 5) {
      const v_val = await this.etapaNexo(impressionDate);
      if (v_val == 1) {
        this.getReport('RCOMERFACTURAS_CHCONANEXO', data);
      } else if (v_val == 2) {
        this.getReport('RCOMERFAC_GRALSNANX', data);
      } else {
        this.alert('warning', 'Atención', 'No se puede visualizar el reporte');
      }
    } else if (pTipo == 6) {
      this.getReport('RCOMERFACTURAS_CHATARRA_SA', data);
    } else if (pTipo == 10) {
      this.getReport('RCOMERFACTURAS_ANEXOS', data);
    } else if (pTipo == 11 && psubtipo == 1) {
      this.getReport('RCOMERCONSENTVEH', data);
    } else if (pTipo == 11 && psubtipo == 2) {
      this.getReport('RCOMERCONSENTBDCA', data);
    } else if (pTipo == 11 && psubtipo == 3) {
      this.getReport('RCOMERCONSENTSBD', data);
    } else if (pTipo == 11 && psubtipo == 4) {
      this.getReport('RCOMERCONSENTAERO', data);
    } else if (pTipo == 11 && psubtipo == 5) {
      this.getReport('RCOMERCONSENTCHCA', data);
    } else if (pTipo == 11 && psubtipo == 6) {
      this.getReport('RCOMERCONSENTCHSA', data);
    } else if (pTipo == 12 && [1, 2, 3, 4, 5, 6].includes(psubtipo)) {
      this.getReport('RCOMERCARTASLIB', { PEVENTO: eventId });
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
        'Atención',
        'No cuenta con los permisos para efectuar esta operación'
      );
    } else {
      const event = data.length > 0 ? data[0].eventId : null;

      if (!event) {
        this.alert('warning', 'Atención', 'Debe consultar un evento');
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
          delete invoice.totaleg;
          delete invoice.totaling;
          delete invoice.ivaeg;
          delete invoice.ivaing;
          delete invoice.precioing;
          delete invoice.precioeg;
          delete invoice.regional;
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
        catchError(() => of(true))
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
      this.alert('warning', 'Atención', 'Favor de seleccionar una factura');
      return;
    }

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

  async impresionCR() {
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
  }

  async actMatricula() {
    if (this.isSelect.length == 0) {
      this.alert('warning', 'Atención', 'Favor de seleccionar una factura');
      return;
    }

    const data = this.isSelect[0];

    if (data.factstatusId == 'PREF') {
      const data = await this.dataFilter2.getAll();

      if (data[0].modmandato ?? false) {
        const exist = await this.exist();

        if (exist > 0) {
          const count = await this.countGood(data[0].goodNot);

          if (count > 0) {
            this.goodProccess
              .updateVal5({ val5: data[0].modmandato }, data[0].goodNot)
              .subscribe({
                next: () => {
                  this.alert('success', 'Matriícula ha sido actualizada', '');
                  this.getComerDetInovice();
                },
                error: err => {
                  this.alert('error', 'Error', err.error.message);
                },
              });
          } else {
            this.alert(
              'warning',
              'Atención',
              'Bien no válido para realizar el cambio'
            );
          }
        } else {
          this.alert(
            'warning',
            'Atención',
            'Usuario inválido para realizar el cambio'
          );
        }
      } else {
        this.alert('warning', 'Atención', 'Debe ingresar la Matrícula');
      }
    } else {
      this.alert(
        'warning',
        'Atención',
        'Estatus de la Factura inválida para realizar el cambio'
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

  sendPackage() {}

  openURL() {
    if (this.selectInovice() == 1) {
      window.open('http://facturacionelec.sae.gob.mx/Log.aspx', '_blank');
    } else {
      this.alert('warning', 'Atención', 'Debe seleccionar un evento');
    }
  }

  async impresionAnex() {
    const num = this.selectInovice();
    const { delegation } = this.form.value;
    if (num == 0 && !delegation) {
      await this.markAll();
      this.impresionAnexReport(1);
    } else if (num == 1 && !delegation) {
      this.impresionAnexReport(0);
    } else if (num == 0 && delegation) {
      await this.markAll();
      this.impresionAnexReport(1);
    }
  }

  impresionAnexReport(option: number) {
    for (let invoice of this.isSelect) {
      //revisar con procedimiento pup_rep_facturas_mas

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
      this.alert('warning', 'Atención', 'Debes seleccionar algún evento');
      return;
    }

    if (!this.isSelect[0].Invoice) {
      this.alert(
        'warning',
        'Atención',
        'No ha capturado el folio de la factura'
      );
      return;
    }

    await this.readParameter();

    this.impresionInvoice();
  }

  async impresionInvoice() {
    for (let invoice of this.isSelect) {
      //revisar con procedimiento pup_rep_facturas_mas
      this.callReport(
        Number(invoice.Type),
        1,
        null,
        1,
        invoice.eventId,
        invoice.billId,
        invoice.impressionDate
      );
      const current: any[] = await this.dataFilter.getAll();
      const index = current.findIndex(inv => inv == this.isSelect[0]);
      current[index].factstatusId = 'IMP';
      this.dataFilter.load(current);
      this.dataFilter.refresh();
      break;
    }
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
      'Se enviara el nuevo CFDI para Atención de Clientes',
      '¿Desea continuar?'
    ).then(answer => {
      if (answer.isConfirmed) {
        this.impresioPackage();
      }
    });
  }

  async impresioPackage() {
    let v_uuid;
    for (const invoice of this.isSelect) {
      if (
        [2, 5].includes(Number(invoice.Type)) &&
        (invoice.exhibit ?? 'S') == 'S'
      ) {
        v_uuid = 0;

        v_uuid = await this.getBill(invoice);

        if (['CFDI', 'IMP'].includes(invoice.factstatusId) && v_uuid == 1) {
          this.alert(
            'warning',
            'Atención',
            `
            El lote ${invoice.batchId} no tiene estatus IMP o CFDI no se podrá imprimir el paquete`
          );
        }
      }

      break;
    }

    this.alert('success', 'El CFDI nuevo fue enviado', '');
  }

  async getBill(invoice: any) {
    const filter = new FilterParams();

    filter.addFilter('billId', invoice.billId, SearchFilter.EQ);
    filter.addFilter('eventId', invoice.eventId, SearchFilter.EQ);
    filter.addFilter('batchId', invoice.batchId, SearchFilter.EQ);
    filter.addFilter('uuid', 'null', SearchFilter.NOT);

    return firstValueFrom(
      this.comerEleBillService.getAll(filter.getParams()).pipe(
        map(() => of(1)),
        catchError(() => of(0))
      )
    );
  }

  cancelInvoice() {
    this.form.get('userV').patchValue(null);
    this.form.get('passwordV').patchValue(null);
    let count: number = 0;

    for (const invoice of this.isSelect) {
      if (!['CFDI', 'IMP'].includes(invoice.factstatusId)) {
        count++;
      }
    }

    if (count == 1) {
      this.alert(
        'warning',
        'Atención',
        'La Factura no tiene un estatus válido para cancelación'
      );
      return;
    } else if (count > 1) {
      this.alert(
        'warning',
        'Atención',
        `La Selección contiene ${count} Facturas que no tienen un estatus válido para cancelación`
      );
      return;
    }

    this.validateCancel();
  }

  async validateCancel() {
    const { causerebillId, folio, refactura } = this.form.value;
    if (!causerebillId) {
      this.isVisibleField(1);
    } else if (causerebillId) {
      if (this.isSelect[0].factstatusId == 'CAN') {
        this.alert(
          'warning',
          'Atención',
          'No puede procesar una factura cancelada'
        );
        this.isVisibleField(0);
        return;
      }
      if (!folio && refactura == 'P') {
        this.alert('warning', 'Atención', 'Introduzca la solicitud de pago');
        return;
      } else if (folio && refactura == 'P') {
        const puf_valid = await this.validaFolSp(this.isSelect[0].eventId);
        if (puf_valid == 0) {
          this.alert(
            'warning',
            'Atención',
            'El Folio de la solicitud de pago no corresponden a la factura, favor de verificar'
          );
          return;
        } else if (puf_valid == 1) {
          this.alert(
            'warning',
            'Atención',
            'Los montos de la solicitud de pago no corresponden a la factura, favor de verificar'
          );
          return;
        } else {
          if (this.isSelect[0].factstatusId == 'CAN') {
            this.alert(
              'warning',
              'Atención',
              'No puede procesar una factura cancelada'
            );
            this.isVisibleField(0);
            return;
          } else {
            await this.pup_invoice();
          }
        }
      }

      let config: ModalOptions = {
        initialState: {
          form: this.form,
          data: this.isSelect,
          global: this.global,
          callback: (data: boolean, val: number) => {
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
      const data = await this.getData(
        this.isSelect[0].eventId,
        Number(idpayment)
      );
      //guardar datos cancelados
      console.log(data);
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

  async exportData() {
    const data: any[] = await this.dataFilter.getAll();

    if (data.length == 0) {
      this.alert('warning', 'Atención', 'Debe consultar un evento');
      return;
    }

    await this.markProcess('EX', null);
    //update los seleccionados

    this.comerInvoice.exportExcell(data[0].eventId).subscribe({
      next: resp => {
        console.log(resp);
        const linkSource = `data:application/xlsx;base64,${resp.resultExcel.base64File}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = linkSource;
        downloadLink.download = 'facturas' + '.xlsx';
        downloadLink.target = '_blank';
        downloadLink.click();
        downloadLink.remove();
      },
      error: () => {
        this.alert(
          'error',
          'Ha ocurrio un fallo en la exportación del archivo',
          ''
        );
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
            } else {
              cont++;
            }
          } else if (aux_valgasto >= 1) {
            contg++;
          }
        } else {
          invoice.process = process;
        }
      }
    }

    if (cont == 1 && aux_val_liq == 0) {
      this.alert(
        'warning',
        'Atención',
        `No se generara el folio de la factura. El lote ${
          this.isSelect[this.isSelect.length - 1].batchId
        } no ha sido afectado`
      );
    } else if (cont > 1 && aux_val_liq == 0) {
      this.alert(
        'warning',
        'Atención',
        `${cont} facturas no pueden ser foliadas, sus lotes no han sido afectados`
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
    } else if (cont > 1 && aux_val_liq > 1) {
      this.alert(
        'warning',
        'Atención',
        `${contg} facturas no pueden ser foliadas, no cumplen las validaciones de los montos(chatarra)`
      );
    }

    return true;
  }

  async viewInvoice() {
    if (this.isSelect.length == 0) {
      this.alert('warning', 'Atención', 'Debe seleccionar algun evento');
      return;
    }
    this.callReport(
      Number(this.isSelect[0].Type),
      2,
      null,
      1,
      this.isSelect[0].eventId,
      this.isSelect[0].billId,
      this.isSelect[0].impressionDate
    );

    this.isSelect = [];
  }

  async viewAnexo() {
    if (this.isSelect.length == 0) {
      this.alert('warning', 'Atención', 'Debe seleccionar algun evento');
      return;
    }

    const date = await this.getDateParameter();

    const val = await this.etapaNexo(this.isSelect[0].impressionDate);

    if (val == 1) {
      for (const inv of this.isSelect) {
        if ([2, 5].includes(Number(inv.Type))) {
          this.callReport(
            Number(this.isSelect[0].Type),
            2,
            null,
            1,
            this.isSelect[0].eventId,
            this.isSelect[0].billId,
            this.isSelect[0].impressionDate
          );
          this.isSelect = [];
        } else {
          this.alert('warning', 'Atención', 'La factura no tiene anexo');
        }
        break;
      }
    } else {
      this.alert(
        'warning',
        'Atención',
        `No se puede visualizar el anexo, la fecha de impresión es nula o es mayor al ${this.datePipe.transform(
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
    const user = this.authService.decodeToken().preferred_username;
    const userValid = await this.validUser('LGONZALEZG' ?? user);
    const data = await this.dataFilter.getAll();
    const { date } = this.form.value;

    if (userValid == 0) {
      this.alert(
        'warning',
        'Atención',
        'No cuenta con los permisos para efectuar esta operación'
      );
    } else {
      if (data.length == 0) {
        this.alert('warning', 'Atención', 'Debe consultar un evento');
        return;
      }
      if (date) {
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
                  'La Fecha de impresión ha sido actualizada',
                  ''
                );
              },
            });
        } else {
          this.alert(
            'warning',
            'Atención',
            'No hay fechas de impresión para actualizar'
          );
        }

        this.form.get('date').patchValue(null);
      } else {
        this.selectAllInvoice(userValid);
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
}

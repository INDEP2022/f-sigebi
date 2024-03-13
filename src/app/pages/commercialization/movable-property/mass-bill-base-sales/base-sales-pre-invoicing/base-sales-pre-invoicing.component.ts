import {
  Component,
  EventEmitter,
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
import { CustomFilterComponent } from 'src/app/@standalone/shared-forms/input-number/input-number';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { InvoiceFolioSeparate } from 'src/app/core/models/ms-invoicefolio/invoicefolio.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ParameterInvoiceService } from 'src/app/core/services/ms-parameterinvoice/parameterinvoice.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BillingsService } from '../../../billing-m/services/services';
import { FolioModalComponent } from '../../../penalty-billing/folio-modal/folio-modal.component';
import { AuthorizationSOIModalComponent } from './authorization-modal/authorization-modal.component';
import { AutorizationModal2Component } from './autorization-modal2/autorization-modal2.component';

@Component({
  selector: 'app-base-sales-pre-invoicing',
  templateUrl: './base-sales-pre-invoicing.component.html',
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
export class BaseSalesPreInvoicingComponent extends BasePage implements OnInit {
  show1 = false;

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  form: FormGroup = new FormGroup({});
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  dataIva: DefaultSelect = new DefaultSelect(
    [
      { id: 1, val: 'SI' },
      { id: 0, val: 'NO' },
    ],
    2
  );
  dataRebill: DefaultSelect = new DefaultSelect();
  isSelect: any[] = [];
  delegation: number;
  @Output() comer: EventEmitter<any> = new EventEmitter(null);
  limit: FormControl = new FormControl(500);

  @ViewChild('myTable', { static: false }) table: TheadFitlersRowComponent;
  get idAllotment() {
    return this.form.get('idAllotment');
  }

  parameterNumFactImp: any = null; //		:PARAMETER.NUMFACTIMP
  parameterIva: any = null; //		:PARAMETER.IVA
  parameterPAutorizado: any = null; //   PARAMETER.P_AUTORIZADO
  invoiceSelected: any = null;
  valSortBy: boolean = false;

  disabledCause: boolean = false;
  disabledDescause: boolean = false;
  disabledRegCanc: boolean = false;
  refactura: string = 'R'; // BLK_CTRL.REFACTURA

  btnLoading: boolean = false;
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

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private comerInvoice: ComerInvoiceService,
    private comerRebilService: ParameterInvoiceService,
    private userService: AuthService,
    private dataUser: UsersService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private eatLotService: LotService,
    private siabService: SiabService,
    private billingsService: BillingsService,
    private comerInvoiceService: ComerInvoiceService
  ) {
    super();

    this.delegation = Number(this.authService.decodeToken().department);

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
          // filter: {
          //   type: 'custom',
          //   component: CustomFilterComponent,
          // },
        },
        batchId: {
          title: 'Lote',
          sort: false,
          // filter: {
          //   type: 'custom',
          //   component: CustomFilterComponent,
          // },
        },
        customer: {
          title: 'Cliente',
          sort: false,
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
          title: 'Tipo',
          sort: false,
          filter: {
            type: 'list',
            config: {
              selectText: 'Todos',
              list: [{ value: 7, title: 'Venta de Bases' }],
            },
          },
          valuePrepareFunction: (val: number) => {
            return val == 7 ? 'Venta de Bases' : '';
          },
        },
        series: {
          title: 'Serie',
          sort: false,
        },
        Invoice: {
          title: 'Folio',
          sort: false,
          // filter: {
          //   type: 'custom',
          //   component: CustomFilterComponent,
          // },
        },
        factstatusId: {
          title: 'Estatus',
          sort: false,
        },
        vouchertype: {
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
        price: {
          title: 'Precio',
          sort: false,
          filter: {
            type: 'custom',
            component: CustomFilterComponent,
          },
          valuePrepareFunction: (val: string) => {
            const formatter = new Intl.NumberFormat('en-US', {
              currency: 'USD',
              minimumFractionDigits: 2,
            });

            return formatter.format(Number(val));
          },
        },
        vat: {
          title: 'IVA',
          sort: false,
          filter: {
            type: 'custom',
            component: CustomFilterComponent,
          },
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
          filter: {
            type: 'custom',
            component: CustomFilterComponent,
          },
          valuePrepareFunction: (val: string) => {
            const formatter = new Intl.NumberFormat('en-US', {
              currency: 'USD',
              minimumFractionDigits: 2,
            });

            return formatter.format(Number(val));
          },
        },
      },
    };
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

  ngOnInit(): void {
    this.paramsList.getValue().limit = 500;
    this.paramsList.getValue()['filter.tpevent'] = `${SearchFilter.EQ}:${11}`;
    this.paramsList.getValue()['sortBy'] = 'batchId,eventId:ASC';
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
              series: () => (searchFilter = SearchFilter.ILIKE),
              Invoice: () => (searchFilter = SearchFilter.EQ),
              factstatusId: () => (searchFilter = SearchFilter.EQ),
              vouchertype: () => (searchFilter = SearchFilter.ILIKE),
              impressionDate: () => (searchFilter = SearchFilter.EQ),
              price: () => (searchFilter = SearchFilter.ILIKE),
              vat: () => (searchFilter = SearchFilter.ILIKE),
              total: () => (searchFilter = SearchFilter.ILIKE),
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
  }

  async getAllComer() {
    const params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    let res = await this.forArrayFilters_();
    console.log(res);
    if (res) {
      this.paramsList.getValue().limit = 500;
      this.paramsList.getValue()['filter.tpevent'] = `${SearchFilter.EQ}:${11}`;
      this.paramsList.getValue()['sortBy'] = 'batchId,eventId:ASC';

      this.totalItems = 0;
      this.dataFilter.load([]);
      this.dataFilter.refresh();
      this.form.get('price').patchValue(0);
      this.form.get('ivaT').patchValue(0);
      this.form.get('total').patchValue(0);

      delete this.paramsList.getValue()['filter.eventId'];
    } else {
      this.loading = true;
      if (!this.valSortBy) params['sortBy'] = `batchId,eventId:ASC`;
      this.comerInvoice.getAllSumInvoice(params).subscribe({
        next: resp => {
          this.loading = false;

          if (resp.count == 0) {
            this.totalItems = 0;
            this.dataFilter.load([]);
            this.dataFilter.refresh();
            this.form.get('price').patchValue(null);
            this.form.get('ivaT').patchValue(null);
            this.form.get('total').patchValue(null);
            return;
          }

          this.totalItems = resp.count;
          this.dataFilter.load(resp.data);
          this.dataFilter.refresh();
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
          this.form.get('price').patchValue(null);
          this.form.get('ivaT').patchValue(null);
          this.form.get('total').patchValue(null);
        },
      });
    }
  }

  getSum() {
    const params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.comerInvoice.getSumTotal(params).subscribe({
      next: resp => {
        this.form.get('price').patchValue(resp.sumprecioeg);
        this.form.get('ivaT').patchValue(resp.sumivaeg);
        this.form
          .get('total')
          .patchValue(Number(resp.sumtotaleg) + Number(resp.sumtotaling));
      },
      error: () => {
        this.form.get('price').patchValue(null);
        this.form.get('ivaT').patchValue(null);
        this.form.get('total').patchValue(null);
      },
    });
  }

  getRebillData(params?: ListParams) {
    params['filter.apply'] = `${SearchFilter.IN}:F,A`;
    params['filter.id'] = `${SearchFilter.EQ}:41`;
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
      event: [null, Validators.required],
      idAllotment: [null],
      iva: [0],
      date: [null],
      causerebillId: [null],
      price: [0],
      ivaT: [0],
      total: [0],
      userV: [null, Validators.required],
      passwordV: [null],
      order: [null],
      numberInvoices: [null],
    });
  }

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  exportAsXLSX(): void {
    //this.excelService.exportAsExcelFile(this.dataFilter, 'facturas_de_eventos');
  }

  delete() {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
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
  aqui() {
    // DECLARE
    //   CONTINUA NUMBER(2) := 0;
    // BEGIN
    //   CONTINUA := VALIDA_ASIGNACION;
    //   IF CONTINUA = 1 THEN
    //     ASIGNA;
    //   END IF;
    // END;
  }
  openModal(): void {
    if (!this.invoiceSelected)
      return this.alert('warning', 'Debe seleccionar una factura', '');

    let config: ModalOptions = {
      initialState: {
        callback: async (next: boolean, data: InvoiceFolioSeparate) => {
          if (next) {
            // const invoice: any[] = await this.dataFilter.getAll();
            // const index = invoice.findIndex(inv => inv == this.isSelect[0]);
            const invoice = this.invoiceSelected;
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
              this.alert('success', 'Factura actualizada correctamente', '');
            }
            this.getAllComer();

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

  async updateInvoice(data: any) {
    return firstValueFrom(
      this.comerInvoice.update(data).pipe(
        map(() => true),
        catchError(() => of(false))
      )
    );
  }

  async generatePreFacture() {
    // if(this.dataFilter.count() == 0)
    //   return this.alert("warning", "No hay data para s", "")
    let next: number = 0;
    this.dataFilter.load([]);
    this.dataFilter.refresh();
    this.totalItems = 0;
    this.form.get('price').patchValue(null);
    this.form.get('ivaT').patchValue(null);
    this.form.get('total').patchValue(null);

    this.btnLoading = true;
    const { event, idAllotment, iva } = this.form.value;

    if (!event)
      return (
        (this.btnLoading = false),
        this.form.controls['event'].markAsTouched(),
        this.alert('warning', 'Debe consultar un evento', '')
      );

    next = await this.getLotePass(); // VALIDA_PREFACTURAS

    if (next == 1) {
      const user = this.userService.decodeToken().preferred_username;
      const data = await this.dataFilter.getAll();

      const event_ = event ? event : data[0].eventId;
      console.log('data', data);
      const aux = await this.getApplicationGetComerPagorefExists(
        event ?? data[0].eventId
      );
      // this.invoiceGenerate(
      //   data[0] ? data[0].eventId : null,
      //   data[0] ? data[0].batchId : null,
      //   event,
      //   iva,
      //   idAllotment,
      //   this.delegation,
      //   user
      // ); // CTRL_GENERA_PREFACTURAS
      let val = true;
      let resul: boolean = true;
      if (aux == 1) {
        if (!idAllotment) {
          let obj = {
            OPCION: 0,
            PEVENTO: event,
            PLOTE: null,
            // PIDFACTURA: null,
            delegationNumber: this.delegation,
            GEN_IVA: iva,
            regional: (await this.validateUser()) == 1 ? null : this.delegation,
            // LOTE: null,
            // toolbarUser: this.userService.decodeToken().preferred_username,
          };
          // GENERA_PREFACTURAS(0,:BLK_CTRL.EVENTO, NULL, NULL);
          resul = await this.getApplicationGeneratePreInvoices(obj);
        } else {
          const cont = await this.contLot(event, idAllotment);
          if (cont == 0) {
            // --SI NO EXISTE EL EVENTO CON EL LOTE
            let obj = {
              OPCION: 1,
              PEVENTO: event_,
              PLOTE: idAllotment || data[0].batchId,
              // PIDFACTURA: null,
              delegationNumber: this.delegation,
              GEN_IVA: iva,
              regional:
                (await this.validateUser()) == 1 ? null : this.delegation,
              // LOTE: idAllotment || data[0].batchId,
              // toolbarUser: this.userService.decodeToken().preferred_username,
            };
            // GENERA_PREFACTURAS(1, NVL(:BLK_CTRL.EVENTO,:COMER_FACTURAS.ID_EVENTO), NVL(:BLK_CTRL.LOTE,:COMER_FACTURAS.ID_LOTE),NULL);
            resul = await this.getApplicationGeneratePreInvoices(obj);
          } else {
            // --SI EXISTE EL EVENTO CON EL LOTE
            let obj = {
              OPCION: 1,
              PEVENTO: event_,
              PLOTE: idAllotment || data[0].batchId,
              // PIDFACTURA: null,
              delegationNumber: this.delegation,
              GEN_IVA: iva,
              regional:
                (await this.validateUser()) == 1 ? null : this.delegation,
              // LOTE: idAllotment || data[0].batchId,
              // toolbarUser: this.userService.decodeToken().preferred_username,
            };
            // GENERA_PREFACTURAS(1, NVL(:BLK_CTRL.EVENTO,:COMER_FACTURAS.ID_EVENTO), NVL(:BLK_CTRL.LOTE,:COMER_FACTURAS.ID_LOTE),NULL);
            resul = await this.getApplicationGeneratePreInvoices(obj);
          }
        }
      } else if (aux == 0) {
        //se abre modal verifiacion ususario
        val = false;
        let config: ModalOptions = {
          initialState: {
            form: this.form,
            callback: async (event: any) => {
              if (event) {
                // GENERA_PREFACTURAS_SOI(:BLK_CTRL.EVENTO);
                console.log(event);
                await this.generateInvoiceIso(event);
              } else {
                this.btnLoading = false;
              }
            },
          },
          class: 'modal-md modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(AuthorizationSOIModalComponent, config);
      } else if (aux == 2) {
        val = false;
        await this.generateInvoiceIso(event ?? data[0].eventId);
      } else if (aux == null) {
        this.btnLoading = false;
        this.alert(
          'warning',
          'Ha ocurrido un fallo en la generación de prefacturas',
          ''
        );
        return;
      }
      if (val) {
        if (aux == 1)
          if (!resul)
            return (
              (this.btnLoading = false),
              this.alert(
                'warning',
                'Ha ocurrido un fallo en la generación de prefacturas',
                ''
              )
            );

        this.btnLoading = false;
        this.alert('success', 'Proceso terminado correctamente', '');
        this.paramsList['filter.eventId'] = `$eq:${event}`;
        await this.forArrayFilters('eventId', event);
        await this.getAllComer();
      }
    } else {
      this.btnLoading = false;
      this.alert('warning', 'Operación Denegada', '');
    }
  }

  async getApplicationGetComerPagorefExists(event: any) {
    return new Promise((resolve, reject) => {
      this.comerInvoiceService
        .getApplicationGetComerPagorefExists(event, event)
        .subscribe({
          next: value => {
            console.log(value);
            resolve(value.AUX_OI);
          },
          error: err => {
            resolve(0);
          },
        });
    });
  }
  getApplicationGeneratePreInvoices(data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.comerInvoiceService
        .getApplicationGeneratePreInvoices(data)
        .subscribe({
          next: value => {
            resolve(true);
          },
          error: err => {
            resolve(false);
          },
        });
    });
  }

  async generateInvoiceIso(pEvent: any) {
    const { event, idAllotment, iva } = this.form.value;
    let data = {
      pEvent,
      ctrlBatch: idAllotment,
      ctrlGenIva: iva,
      ctrlEvent: event,
      toolbarNoDelegation: this.delegation,
      toolbarUser: this.userService.decodeToken().preferred_username,
    };
    console.log(data);
    let result = await this.generateInvoiceSoi(data);
    if (!result)
      return (
        (this.btnLoading = false),
        this.alert(
          'warning',
          'Ha ocurrido un fallo en la generación de prefacturas',
          ''
        )
      );

    this.btnLoading = false;
    this.alert('success', 'Prefacturas Generadas', '');
    this.paramsList['filter.eventId'] = `$eq:${event}`;
    await this.forArrayFilters('eventId', event);
    await this.getAllComer();
  }

  async generateInvoiceSoi(data: any) {
    return firstValueFrom(
      this.comerInvoiceService.procedureGenerate(data).pipe(
        map(() => true),
        catchError(() => of(false))
      )
    );
  }

  async getLotePass() {
    const { event, idAllotment } = this.form.value;
    const next = await this.validatePreFactura();

    if (next == 1) {
      this.alert(
        'warning',
        'No cuenta con los permisos para realizar esta operación',
        ''
      );
      return 0;
    }

    if (!event) {
      this.alert('warning', 'Atención', 'Debe especificar un evento');
      return 0;
    }

    if (idAllotment) {
      const count = await this.countLot(event, idAllotment);
      const cont = await this.contLot(event, idAllotment);
      const aux = await this.auxLot(event, idAllotment);

      if (cont == 0) {
        this.alert('warning', 'Atención', 'El Lote no existe');
        return 0;
      } else if (count == 0) {
        this.alert('warning', 'Atención', 'El Lote aún no está pagado');
        return 0;
      } else if (aux != 0) {
        this.alert(
          'warning',
          'Atención',
          `Ya se han asignado folio al Lote: ${idAllotment}`
        );
        this.paramsList['filter.eventId'] = `$eq:${event}`;
        await this.forArrayFilters('eventId', event);
        this.getAllComer();

        return 0;
      }

      return 1;
    }

    const select = this.selectInovice();

    if (select == 0) {
      //servicio en espera
      const aux = 0;

      if (aux == 0) {
        return 1;
      }
      this.alert(
        'warning',
        'Atención',
        `Ya se han asignado folio al Lote: ${idAllotment}`
      );
      this.paramsList['filter.eventId'] = `$eq:${event}`;
      await this.forArrayFilters('eventId', event);
      this.getAllComer();

      return 0;
    }

    return 0;
  }

  selectInovice(): number {
    return this.isSelect.length > 0 ? 1 : 0;
  }

  resetParams() {
    this.columnFilters = [];
    this.isSelect = [];
    // this.paramsList = new BehaviorSubject(new ListParams());
    this.paramsList.getValue().limit = 500;
    this.paramsList.getValue()['filter.tpevent'] = `${SearchFilter.EQ}:${11}`;
    this.paramsList.getValue()['sortBy'] = 'batchId,eventId:ASC';
    this.dataFilter.reset();
    this.settings = {
      ...this.settings,
    };
  }

  async countLot(event: number, lote: number) {
    const filter = new FilterParams();
    filter.addFilter('idEvent', event, SearchFilter.EQ);
    filter.addFilter('lotPublic', lote, SearchFilter.EQ);
    filter.addFilter('idStatusVta', 'VEN,PAG', SearchFilter.IN);
    return firstValueFrom(
      this.eatLotService.getAllComerLotsFilter(filter.getParams()).pipe(
        map(resp => resp.count),
        catchError(() => of(0))
      )
    );
  }

  async contLot(event: number, lote: number) {
    const filter = new FilterParams();
    filter.addFilter('idEvent', event, SearchFilter.EQ);
    filter.addFilter('lotPublic', lote, SearchFilter.EQ);
    return firstValueFrom(
      this.eatLotService.getAllComerLotsFilter(filter.getParams()).pipe(
        map(resp => resp.count),
        catchError(() => of(0))
      )
    );
  }

  async auxLot(event: number, lote: number) {
    const filter = new FilterParams();
    filter.addFilter('eventId', event, SearchFilter.EQ);
    filter.addFilter('batchId', lote, SearchFilter.EQ);
    filter.addFilter('Invoice', '$null', SearchFilter.NOT);
    return firstValueFrom(
      this.comerInvoice.getAll(filter.getParams()).pipe(
        map(resp => resp.count),
        catchError(() => of(0))
      )
    );
  }

  async invoiceGenerate(
    eventId: number,
    batchId: number,
    ctrlEvent: number,
    ctrlGenIva: number,
    ctrlBatch: number,
    toolbarNoDelegation: number,
    toolbarUser: string
  ) {
    return firstValueFrom(
      this.comerInvoice
        .preInvoiceGenerate({
          eventId,
          batchId,
          ctrlEvent,
          ctrlGenIva,
          ctrlBatch,
          toolbarNoDelegation,
          toolbarUser,
        })
        .pipe(
          map(resp => resp.auxOi),
          catchError(() => of(null))
        )
    );
  }

  async validatePreFactura() {
    const user = this.userService.decodeToken().preferred_username;
    return firstValueFrom(
      this.comerInvoice.validateUSer(user).pipe(
        map(resp => resp.lValUsu),
        catchError(() => of(0))
      )
    );
  }

  async updateData() {
    if (this.isSelect.length == 0)
      return this.alert(
        'warning',
        'Debe seleccionar facturas para actualizar datos',
        ''
      );
    let valid: number = 0;
    const validUser = 1;
    await this.validateUser();

    if (validUser == 1) {
      valid = 1;

      if (valid == 1) {
        this.btnLoading4 = true;
        let result = this.isSelect.map(async comer => {
          //regxlote primer service
          await this.regXLote(comer.eventId, comer.batchId);

          if (comer.Type == 7) {
            const { iva } = this.form.value;
            await this.factBases(
              comer.eventId,
              comer.batchId,
              2,
              comer.billId,
              iva ? iva : 0,
              this.delegation
            );
            //datos fact base service
          }

          await this.dataCoord(comer.eventId, comer.billId);
          //datos_cooreg service
        });
        Promise.all(result).then(resp => {
          this.btnLoading4 = false;
          this.alert('success', 'Proceso terminado correctamente', '');
          this.getAllComer();
        });
      }
    } else {
      this.alert(
        'warning',
        'No cuenta con los permisos para realizar esta operación',
        ''
      );
    }
  }

  async factBases(
    pEvent: string,
    pLot: string,
    pOption: number,
    pInvoiceId: string,
    genVat: number,
    pDelegationIssues: number
  ) {
    return firstValueFrom<any>(
      this.comerInvoice
        .factBases({
          pEvent,
          pLot,
          pOption,
          pInvoiceId,
          genVat,
          pDelegationIssues,
        })
        .pipe(
          map(resp => resp),
          catchError(() => of(true))
        )
    );
  }

  async regXLote(eventId: string, lotId: string) {
    return firstValueFrom<any>(
      this.comerInvoice.regXLote({ eventId, lotId }).pipe(
        map(resp => resp),
        catchError(() => of(true))
      )
    );
  }

  async dataCoord(eventId: string, invoice: string) {
    return firstValueFrom<any>(
      this.comerInvoice.dataCoord({ eventId, invoice }).pipe(
        map(resp => resp),
        catchError(() => of(true))
      )
    );
  }

  async validateUser() {
    const user = this.userService.decodeToken().username.toUpperCase();
    const next = await this.validatePreFactura();
    return next;
  }

  async generateInvoice() {
    const { event } = this.form.value;
    this.btnLoading2 = true;
    const validUser = await this.validateUser();

    if (validUser == 1) {
      this.alert(
        'warning',
        'No cuenta con los permisos para realizar esta operación',
        ''
      );
      this.btnLoading2 = false;
    } else {
      const data = await this.dataFilter.getAll();
      if (!event && !data[0]) {
        this.alert('warning', 'Debe especificar un evento', '');
        this.btnLoading2 = false;
        return;
      }
      this.procedureInvoice();
    }
  }

  async procedureInvoice() {
    let validaFol: number = 0;
    const { event } = this.form.value;
    const data = await this.dataFilter.getAll();
    const eventId = event ?? data[0].eventId;

    validaFol = await this.validateInvoice(11 ?? data[0].tpevent, eventId);

    if (validaFol == 1) {
      //service de actualizar

      // MARCA_PROCESADO
      let res = await this.processMark('FL', 'PREF');
      console.log('res', res);
      // COMER_CTRLFACTURA.GENERA_FOLIOS(:COMER_FACTURAS.ID_EVENTO, :COMER_FACTURAS.TPEVENTO);
      await this.generateInvoiceCtrl(eventId, 11 ?? data[0].tpevent);

      // VERIFICA_PROV_CANCE;
      await this.verifyProv();

      // MODIFICA_WHERE_DETALLE(PEVENTO);
      this.alert('success', 'Se generaron los folios correctamente', '');
      this.paramsList['filter.eventId'] = `$eq:${eventId}`;
      await this.forArrayFilters('eventId', eventId);
      this.getAllComer();
      this.btnLoading2 = false;
    } else {
      this.alert(
        'warning',
        'No existen folios disponibles para el tipo de documento Venta de Bases',
        ' verifique sus series '
      );
      this.btnLoading2 = false;
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

  async verifyProv() {
    const data: any[] = await this.dataFilter.getAll();

    let result = data.map(async comer => {
      if (comer.archImgtemp && comer.Invoice && comer.factstatusId != 'CAN') {
        let obj = {
          billId: comer.billId,
          eventId: comer.eventId,
          factstatusId: 'FOL',
        };
        let result = await this.billingsService.updateBillings(obj);
        if (result) {
          comer.factstatusId = 'FOL';
        }
        // comer.factstatusId = 'FOL';
      }
    });

    Promise.all(result).then(resp => {
      this.dataFilter.refresh();
    });
  }

  // MARCA_PROCESADO
  async processMark(procesando: string, valido: string) {
    let aux_status: string = '';
    if (valido == null) {
      aux_status = null;
    } else {
      aux_status = valido;
    }

    let result = this.isSelect.map(async comer => {
      console.log('SI', comer.factstatusId + '==' + aux_status);
      if (comer.factstatusId == aux_status) {
        let obj = {
          billId: comer.billId,
          eventId: comer.eventId,
          process: procesando,
        };
        console.log('SI');
        let result = await this.billingsService.updateBillings(obj);

        if (result) {
          comer.process = procesando;
        }
      }
    });
    Promise.all(result).then(resp => {
      return true;
    });
  }

  async validateInvoice(tpEvento: string, id_evento: string) {
    return firstValueFrom(
      this.comerInvoice.validateFolio({ tpEvento, id_evento }).pipe(
        map(resp => resp.rspta),
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

    let aux: number;
    this.btnLoading3 = true;
    aux = this.validateInvoiceDelete(); // VALIDA_ELIMINA_FOLIOS

    console.log(aux);

    if (aux == 1) {
      let ress = await this.processMark('EF', 'FOL'); // MARCA_PROCESADO
      console.log('AQUI', ress);
    } else if (aux == 0) {
      this.btnLoading3 = false;
      return;
    }

    //ejecutar service paquete elimina folios
    // **EDWIN 1** // **LISTO** //
    // COMER_CTRLFACTURA.ELIMINA_FOLIOS(:COMER_FACTURAS.ID_EVENTO, NULL);
    this.comerInvoice
      .deleteFolio({ eventId: data[0].eventId, invoiceId: null })
      .subscribe({
        next: () => {
          this.alert('success', 'Folios', 'Eliminados Correctamente');
          this.getAllComer();
          this.btnLoading3 = false;
        },
        error: err => {
          if (err.status == 400) {
            this.btnLoading3 = false;
            this.alert('warning', 'No se encontraron registros', '');
          } else {
            this.btnLoading3 = false;
            this.alert(
              'error',
              'Ocurrió un error al intentar eliminar los folios',
              err.error.message
            );
          }
        },
      });
  }

  validateInvoiceDelete(): number {
    for (let comer in this.isSelect) {
      if (this.isSelect[comer].factstatusId != 'FOL') {
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

  async allSelect() {
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
                  'La fecha de impresión ha sido actualizada',
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

  async validUser(user: string) {
    return firstValueFrom<number>(
      this.comerInvoice.validateUSer(user).pipe(
        map(resp => resp.lValUsu),
        catchError(error => of(0))
      )
    );
  }

  async rowsSelected(event: any) {
    if (event) {
      this.invoiceSelected = event.data;
    }
  }
  async exportExcel() {
    // ** EDWIN ** 2 // ENDPOINT LISTO // YELTSIN
    // EXPORTACIÓN DE EXCEL //
    const data: any[] = await this.dataFilter.getAll();

    if (data.length == 0)
      return this.alert('warning', 'Debe consultar un evento', '');

    if (this.isSelect.length == 0)
      return this.alert(
        'warning',
        'No hay facturas seleccionadas para exportar',
        ''
      );

    this.btnLoading13 = true;
    let arr = this.isSelect;
    let arr_ = [];
    let result = arr.map(async item => {
      let obj = {
        billId: item.billId,
        eventId: item.eventId,
        process: 'EX',
      };
      arr_.push(obj);
      // await this.billingsService.updateBillings(obj);
    });

    let resp = await this.putApplicationPutProcess(arr_);
    // console.log(resp)

    Promise.all(result).then(resp => {
      let body = {
        eventId: data[0].eventId,
      };
      this.eatLotService.getAppsExportExcelComerFacturas(body).subscribe({
        next: async response => {
          const base64 = response.base64File;
          const nameFile = response.nameFile;
          await this.downloadExcel(base64, nameFile);

          arr_ = [];
          let result_ = arr.map(async item => {
            let obj = {
              billId: item.billId,
              eventId: item.eventId,
              process: null,
            };
            arr_.push(obj);
            // await this.billingsService.updateBillings(obj);
          });

          Promise.all(result_).then(async resp => {
            let resp_ = await this.putApplicationPutProcess(arr_);
            // const base64 = response.base64File;
            // const nameFile = response.nameFile;
            // await this.downloadExcel(base64, nameFile);
          });
        },
        error: err => {
          this.btnLoading13 = false;
          this.alert('warning', 'No se pudo descargar el excel', '');
        },
      });
    });
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

  async downloadExcel(base64String: any, nameFile: string) {
    const mediaType =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
    const link = document.createElement('a');
    link.href = mediaType + base64String;
    link.download = nameFile;
    link.click();
    link.remove();
    this.btnLoading13 = false;
    this.alert('success', 'El archivo se ha descargado', '');
  }

  async printInvoice() {
    const { event } = this.form.value;
    const data = await this.dataFilter.getAll();
    if (!this.invoiceSelected) {
      this.alert('warning', 'Debe seleccionar una factura', '');
      return;
    }
    if (!this.invoiceSelected.eventId) {
      this.alert('warning', 'Debe seleccionar un evento', '');
      return;
    }

    if (!this.invoiceSelected.Invoice) {
      this.alert('warning', 'No ha capturado el folio de la factura', '');
      return;
    }

    await this.readParameter(); // LEE_PARAMETROS;
    this.printerInvoice();
  }
  printerInvoice() {
    this.printerReport(this.invoiceSelected.Type, 1); // LLAMA_REPORTE;
  }

  async readParameter() {
    // LEE_PARAMETROS

    const num: any = await this.billingsService.getParamterModSab(
      'NUMFACTIMP',
      'M'
    );
    if (num) this.parameterNumFactImp = num.valor;
    else this.parameterNumFactImp = null;

    const iva: any = await this.billingsService.getParamterModSab('IVA', 'C');
    if (iva) this.parameterIva = num.valor;
    else this.parameterIva = null;

    return true;
  }

  async printerReport(PTIPO: number, PMODO: number) {
    // LLAMA_REPORTE
    let V_DISPOSITIVO: string;
    let V_IMAGEN: number;
    let reportName: string = '';

    if (PMODO == 1) {
      // IMPRIMIR //
      V_DISPOSITIVO = 'PRINTER';
      V_IMAGEN = 1;
    } else if (PMODO == 2) {
      // VA A PANTALLA Y NO SE IMPRIME LA IMAGEN //
      V_DISPOSITIVO = 'SCREEN';
      V_IMAGEN = 0;
    }

    if (PTIPO == 7) {
      // PARA IMPRIMIR FACTURA DE VENTA DE BASES //
      reportName = 'RCOMERFACTURAS_BASES';
    }

    let params = {
      PARAMFORM: 'NO',
      DESTYPE: V_DISPOSITIVO,
      PEVENTO: this.invoiceSelected.eventId,
      PFACTURA: this.invoiceSelected.billId,
    };

    this.runReport(reportName, params);
  }

  runReport(reportName: string, params: any) {
    this.siabService
      // .fetchReport(reportName, params)
      .fetchReportBlank('blank')
      .subscribe(response => {
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }

  changeOpt(event: any) {
    if (event == 1) this.paramsList.getValue()['sortBy'] = `batchId:ASC`;
    if (event == 2)
      this.paramsList.getValue()['sortBy'] = `delegationNumber:ASC`;
    if (event == 4) this.paramsList.getValue()['sortBy'] = `Invoice:ASC`;

    this.valSortBy = true;
    if (!event) this.valSortBy = false;

    this.getAllComer();
    // this.valDefaultWhere
  }

  async regCanc() {
    // REGCANC
    this.parameterPAutorizado = 0;
    this.visualCancelYesNot(0);
  }

  // VISUALIZA_CANCELA_SINO
  visualCancelYesNot(pYesNo: number) {
    if (pYesNo == 1) {
      this.disabledCause = true;
      this.disabledDescause = true;
      this.disabledRegCanc = true;
      this.getRebillData(new ListParams());
    } else if (pYesNo == 0) {
      this.disabledCause = false;
      this.disabledDescause = false;
      this.disabledRegCanc = false;
      this.form.get('causerebillId').setValue(null);
      // this.form.get('descause').setValue(null);
    }
  }

  visualInvoice() {
    if (!this.invoiceSelected) {
      this.alert('warning', 'Debe seleccionar una factura', '');
      return;
    }
    if (!this.invoiceSelected.eventId) {
      this.alert('warning', 'Debe seleccionar un evento', '');
      return;
    }

    this.printerReport(this.invoiceSelected.Type, 2); // LLAMA_REPORTE;
  }

  cancelInvoice() {
    if (this.isSelect.length == 0) {
      this.alert(
        'warning',
        'Debe seleccionar al menos una factura para cancelar',
        ''
      );
      return;
    }
    // :BLK_CTRL.USUARIO_AUT := NULL;
    // :BLK_CTRL.PASSWORD_AUT := NULL;
    let PREG = this.isSelect;
    this.cancelInvoiceVal(PREG); // -- PRIMERO VALIDAMOS CAUSA Y FOLIO SP
  }

  cancelInvoiceVal(bills: any) {
    // if(this.isSelect.length == 0)
    //   return this.alert('warning', 'Debe seleccionar las facturas a cancelar', '')
    const data: Array<any> = bills;
    if (!this.form.get('causerebillId').value) {
      this.visualCancelYesNot(1); // muestra los campos de la causa
    } else {
      let point = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].factstatusId == 'CAN') {
          point = 1;
          break;
        } else if (data[i].factstatusId == 'NCR') {
          point = 2;
          break;
        }
      }
      if (point == 0) this.openAutorizacion();
      else if (point == 1)
        this.visualCancelYesNot(0),
          this.alert('warning', 'No puede procesar una factura cancelada', '');
      else if (point == 2)
        this.visualCancelYesNot(0),
          this.alert('warning', 'No puede cancelar una factura NCR', '');
      // SHOW_VIEW('AUTORIZACION');
      // GO_ITEM('BLK_CTRL.USUARIO_AUT');
    }
  }

  openAutorizacion() {
    if (this.isSelect.length == 0)
      return this.alert(
        'warning',
        'No hay facturas seleccionadas para cancelar',
        ''
      );

    let config: ModalOptions = {
      initialState: {
        bills: this.isSelect,
        form: this.form,
        callback: (aux_auto: number) => {
          this.parameterPAutorizado = aux_auto;
          if (aux_auto == 1) this.processingCancelled();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AutorizationModal2Component, config);
  }

  processingCancelled() {
    if (this.isSelect.length == 0)
      return this.alert(
        'warning',
        'No hay facturas seleccionadas para cancelar',
        ''
      );

    this.btnLoading6 = true;
    const { causerebillId } = this.form.value;
    let point = 1;
    let result = this.isSelect.map(async item => {
      let YYYY = this.datePipe.transform(item.impressionDate, 'YYYY');
      let CF_LEYENDA = '';
      let CF_NUEVAFACT: any = 0;
      if (!item.folioinvoiceId)
        return (
          (point = 2),
          (this.btnLoading6 = false),
          this.alert(
            'warning',
            `No se puede cancelar una factura sin folio para el evento: ${item.eventId} y lote: ${item.batchId}`,
            ''
          )
        );
      else if (item.series.length > 1)
        CF_LEYENDA = `ESTE CFDI REFIERE AL CFDI ${item.series}-${item.folioinvoiceId}`;
      else
        CF_LEYENDA = `ESTE CFDI REFIERE A LA FACTURA ${item.series}-${item.folioinvoiceId}`;

      if (this.refactura == 'R') {
        // CREA OTRA FACTURA SIN FOLIO Y CANCELA LA ACTUAL
        console.log('da', Number(YYYY));
        if (Number(YYYY) > 2011) {
          console.log('HOLA');
          // SE CANCELA Y SE CREA UN CFDI INGRESO (FAC) Y UN CFDI DE EGRESO (NCR)
          // **EDWIN** 3// ** YELTSIN ** //
          //   CF_NUEVAFACT := COPIA_FACTURA_VTA_BASES(
          // :COMER_FACTURAS.ID_EVENTO,
          // :COMER_FACTURAS.ID_LOTE,
          //  :COMER_FACTURAS.ID_FACTURA,
          //  CF_LEYENDA,
          //  :BLK_CTRL.USUARIO_AUT,
          //  'PREF',1,0,
          //  :BLK_TOOLBAR.TOOLBAR_NO_DELEGACION,
          //  :BLK_CTRL.CAUSA);
          let obj = {
            PCFDI: 0,
            PEVENTO_O: item.eventId,
            PLOTE: item.batchId,
            PIDFACTURA_O: item.billId,
            PDEL_EMITE: this.authService.decodeToken().department,
            PCAUSA: causerebillId,
            PESTATUS: 'PREF',
            PLEYENDA: CF_LEYENDA,
          };
          CF_NUEVAFACT = await this.copyBillVTABases(obj);
          console.log('CF_NUEVAFACT', CF_NUEVAFACT);
        }
        if (CF_NUEVAFACT > 0) {
          let obj = {
            billId: item.billId,
            eventId: item.eventId,
            IauthorizeDate: new Date(), // FECHA_AUTORIZO
            userIauthorize: this.authService.decodeToken().preferred_username,
            causerebillId: this.form.get('causerebillId').value, // ID_CAUSAREFACTURA
            factstatusId: 'CAN', // ID_ESTATUSFACT
          };
          await this.billingsService.updateBillings(obj);
          // CANCELAR_FACTURA(:COMER_FACTURAS.ID_FACTURA);
        } else {
          point = 0;
        }
      }
    });
    Promise.all(result).then(resp => {
      this.btnLoading6 = false;
      if (point == 0) {
        return (
          (this.btnLoading6 = false),
          this.alert('error', 'Falló la operación, consulte sistemas', '')
        );
      } else if (point == 1) {
        this.alert('success', 'Facturas canceladas correctamente', '');
        this.getAllComer();
      } else {
      }
    });
  }

  async copyBillVTABases(obj: any) {
    return new Promise((resolve, reject) => {
      this.comerInvoice.getCtrlInvoiceCopyBillVtaBases(obj).subscribe({
        next: value => {
          resolve(1);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async sendPackage() {
    console.log('Consultar con Carlos');
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
    } else if (filterConf.filters.length == 0 && value) {
      filterConf.filters.push({ field: field, search: value });
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

  async resetTable() {
    // this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.loading = true;
    this.paramsList.getValue()['filter.tpevent'] = `${SearchFilter.EQ}:${11}`;
    this.paramsList.getValue()['sortBy'] = 'batchId,eventId:ASC';
    this.paramsList.getValue().limit = 500;
    this.paramsList.getValue().pageSize = 500;
    this.paramsList.getValue().take = 500;
    this.dataFilter.getFilter().filters = [];
    this.dataFilter.refresh();

    this.dataFilter.load([]);
    this.dataFilter.refresh();

    this.totalItems = 0;

    // this.resetInput();
    this.form.get('price').patchValue(0);
    this.form.get('ivaT').patchValue(0);
    this.form.get('total').patchValue(0);

    this.loading = false;
  }
}

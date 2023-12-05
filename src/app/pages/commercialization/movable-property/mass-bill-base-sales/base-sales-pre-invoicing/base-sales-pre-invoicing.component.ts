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
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
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

@Component({
  selector: 'app-base-sales-pre-invoicing',
  templateUrl: './base-sales-pre-invoicing.component.html',
  styles: [],
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

  @ViewChild('table', { static: true }) table: Ng2SmartTableComponent;

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
  refactura: string = ''; // BLK_CTRL.REFACTURA
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
    private billingsService: BillingsService
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
          title: 'Tipo',
          sort: false,
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
          filter: {
            type: 'custom',
            component: CustomFilterComponent,
          },
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
    this.paramsList.getValue()['sortBy'] = 'batchId,eventId,customer:ASC';
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

  getAllComer() {
    const params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.loading = true;
    if (!this.valSortBy) params['sortBy'] = `batchId,eventId,customer:ASC`;
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
      event: [null],
      idAllotment: [null],
      iva: [0],
      date: [null],
      causerebillId: [null],
      price: [null],
      ivaT: [null],
      total: [null],
      userV: [null, Validators.required],
      passwordV: [null, Validators.required],
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

            let resp = await this.updateInvoice(invoice[index]);
            if (!resp) {
              this.alert('warning', 'No se pudo actualizar la factura', '');
            } else {
              this.alert('success', '', 'Factura actualizada correctamente');
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
    let config: ModalOptions = {
      initialState: {
        form: this.form,
        callback: (data: boolean, val: number) => {},
        callback2: (aux_auto: number) => {
          this.parameterPAutorizado = aux_auto;
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AuthorizationSOIModalComponent, config);

    return;
    let next: number = 0;
    this.dataFilter.load([]);
    this.dataFilter.refresh();
    this.totalItems = 0;
    const { event, idAllotment, iva } = this.form.value;
    next = await this.getLotePass();

    if (next == 1) {
      const user = this.userService.decodeToken().preferred_username;
      const data = await this.dataFilter.getAll();
      const aux = await this.invoiceGenerate(
        data[0] ? data[0].eventId : null,
        data[0] ? data[0].batchId : null,
        event,
        iva,
        idAllotment,
        this.delegation,
        user
      );

      if (aux == 0) {
        //se habre modal verifiacion ususario
      }

      if (!aux) {
        this.alert(
          'warning',
          'Atención',
          'Ha ocurrido un fallo en la generación de prefacturas'
        );
        return;
      }

      this.alert('success', 'Prefacturas Generadas', '');
      this.resetParams();
      this.columnFilters['filter.eventId'] = `$eq:${event}`;
      this.getAllComer();
    } else {
      this.alert('warning', 'Operación Denegada', '');
    }
  }

  async getLotePass() {
    const { event, idAllotment } = this.form.value;
    const next = await this.validatePreFactura();

    if (next == 0) {
      this.alert(
        'warning',
        'Atención',
        'No cuenta con los permisos para efectuar esta operación'
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
        this.resetParams();
        this.columnFilters['filter.eventId'] = `$eq:${event}`;
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
      this.resetParams();
      this.columnFilters['filter.eventId'] = `$eq:${event}`;
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
    this.paramsList = new BehaviorSubject(new ListParams());
    this.paramsList.getValue().limit = 500;
    this.paramsList.getValue()['filter.tpevent'] = `${SearchFilter.EQ}:${11}`;
    this.paramsList.getValue()['sortBy'] = 'batchId,eventId,customer:ASC';
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
    let valid: number = 0;
    const validUser = await this.validateUser();

    if (validUser == 1) {
      valid = 1;

      if (valid == 1) {
        this.isSelect.map(async comer => {
          //regxlote primer service
          await this.regXLote(comer.eventId, comer.batchId);

          if (Number(comer.Type) == 7) {
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
      }
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
    return firstValueFrom(of(1));
  }

  async generateInvoice() {
    const { event } = this.form.value;
    const validUser = await this.validateUser();

    if (validUser == 0) {
      this.alert(
        'error',
        'Error',
        'No cuenta con los permisos para efectuar esta operación'
      );
    } else {
      const data = await this.dataFilter.getAll();
      if (!event && !data[0]) {
        this.alert('warning', 'Debe especificar un evento', '');
        return;
      }

      this.procedureInvoice();
    }
  }

  async procedureInvoice() {
    let validaFol: number = 0;

    const data = await this.dataFilter.getAll();

    validaFol = await this.validateInvoice(data[0].tpevent, data[0].eventId);

    if (validaFol == 1) {
      //service de actualizar

      this.processMark('FL', 'PREF'); // MARCA_PROCESADO

      //service paquete genera folios

      this.verifyProv();
    }
  }

  async verifyProv() {
    const data: any[] = await this.dataFilter.getAll();

    data.map(comer => {
      if (comer.archImgtemp && comer.Invoice && comer.factstatusId != 'CAN') {
        comer.factstatusId = 'FOL';
      }
    });
  }

  processMark(procesando: string, valido: string) {
    // MARCA_PROCESADO
    let aux_status: string = '';
    if ((valido = 'NULL')) {
      aux_status = null;
    } else {
      aux_status = valido;
    }

    this.isSelect.map(comer => {
      if (comer.factstatusId == aux_status) {
        comer.process = procesando;
      }
    });
  }

  async validateInvoice(tpEvento: string, id_evento: string) {
    return firstValueFrom(
      this.comerInvoice.validateFolio({ tpEvento, id_evento }).pipe(
        map(resp => resp),
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

    let aux: number;

    aux = this.validateInvoiceDelete(); // VALIDA_ELIMINA_FOLIOS

    console.log(aux);

    if (aux == 1) {
      this.processMark('EF', 'FOL'); // MARCA_PROCESADO
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
        },
        error: err => {
          this.alert(
            'error',
            'Ocurrió un error al intentar eliminar los folios',
            err.error.message
          );
        },
      });
  }

  validateInvoiceDelete(): number {
    for (let comer in this.isSelect) {
      if (this.isSelect[comer].factstatusId != 'FOL') {
        this.alert(
          'warning',
          'Soló se puede eliminar folios de facturas con estatus FOL, si lo desea puede cancelarla',
          ''
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
        'Atención',
        'No cuenta con los permisos para realizar esta operación'
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
    // ** EDWIN ** 2 //
    // EXPORTACIÓN DE EXCEL //
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

    if (!this.invoiceSelected.folioinvoiceId) {
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
    if (event == 1) this.paramsList.getValue()['sortBy'] = `batchId:DESC`;
    if (event == 2)
      this.paramsList.getValue()['sortBy'] = `delegationNumber:DESC`;
    if (event == 4) this.paramsList.getValue()['sortBy'] = `Invoice:DESC`;

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

  visualCancelYesNot(pYesNo: number) {
    // VISUALIZA_CANCELA_SINO
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
    if (!this.invoiceSelected) {
      this.alert('warning', 'Debe seleccionar una factura', '');
      return;
    }
    // :BLK_CTRL.USUARIO_AUT := NULL;
    // :BLK_CTRL.PASSWORD_AUT := NULL;
    let PREG = this.invoiceSelected;
    this.cancelInvoiceVal(PREG); // -- PRIMERO VALIDAMOS CAUSA Y FOLIO SP
  }

  cancelInvoiceVal(bill: any) {
    if (this.form.get('causerebillId').value) {
      this.visualCancelYesNot(1); // muestra los campos de la causa
    } else {
      if (bill.factstatusId == 'CAN')
        return (
          this.visualCancelYesNot(0),
          this.alert('warning', 'No puede procesar una factura cancelada', '')
        );
      else if (bill.factstatusId == 'NCR')
        return (
          this.visualCancelYesNot(0),
          this.alert('warning', 'No puede cancelar una factura NCR', '')
        );
      // SHOW_VIEW('AUTORIZACION');
      this.openAutorizacion();
      // GO_ITEM('BLK_CTRL.USUARIO_AUT');
    }
  }

  openAutorizacion() {
    let config: ModalOptions = {
      initialState: {
        form: this.form,
        callback: (data: boolean, val: number) => {},
        callback2: (aux_auto: number) => {
          console.log('aux_auto', aux_auto);
          this.parameterPAutorizado = aux_auto;
          this.processingCancelled();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AuthorizationSOIModalComponent, config);
  }

  processingCancelled() {
    if (this.isSelect.length == 0)
      return this.alert('warning', 'No hay facturas seleccionadas', '');

    let result = this.isSelect.map(async item => {
      let YYYY = this.datePipe.transform(item.impressionDate, 'YYYY');
      let CF_LEYENDA = '';
      let CF_NUEVAFACT: any = 0;
      if (!item.folioinvoiceId)
        return this.alert(
          'warning',
          `No se puede cancelar una factura sin folio para el evento: ${item.eventId} y lote: ${item.batchId}`,
          ''
        );
      else if (item.series.length > 1)
        CF_LEYENDA = `ESTE CFDI REFIERE AL CFDI ${item.series}-${item.folioinvoiceId}`;
      else
        CF_LEYENDA = `ESTE CFDI REFIERE A LA FACTURA ${item.series}-${item.folioinvoiceId}`;

      if (this.refactura == 'R') {
        // CREA OTRA FACTURA SIN FOLIO Y CANCELA LA ACTUAL
        if (Number(YYYY) > 2011) {
          // SE CANCELA Y SE CREA UN CFDI INGRESO (FAC) Y UN CFDI DE EGRESO (NCR)
          // **EDWIN** 3//
          //   CF_NUEVAFACT := COPIA_FACTURA_VTA_BASES(:COMER_FACTURAS.ID_EVENTO,:COMER_FACTURAS.ID_LOTE, :COMER_FACTURAS.ID_FACTURA, CF_LEYENDA, :BLK_CTRL.USUARIO_AUT, 'PREF',1,0,:BLK_TOOLBAR.TOOLBAR_NO_DELEGACION,:BLK_CTRL.CAUSA);
          CF_NUEVAFACT = await this.copyBillVTABases();
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
          return this.alert(
            'error',
            'Falló la operación, consulte sistemas',
            ''
          );
        }
      }
    });
    Promise.all(result).then(resp => {
      this.getAllComer();
    });
  }

  async copyBillVTABases() {
    return 1;
  }

  async sendPackage() {
    console.log('Consultar con Carlos');
  }
}

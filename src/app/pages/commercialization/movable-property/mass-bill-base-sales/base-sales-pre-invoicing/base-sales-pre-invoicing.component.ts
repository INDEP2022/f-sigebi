import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { BasePage } from 'src/app/core/shared/base-page';
//XLSX
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
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { ParameterInvoiceService } from 'src/app/core/services/ms-parameterinvoice/parameterinvoice.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FolioModalComponent } from '../../../penalty-billing/folio-modal/folio-modal.component';

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
    private userService: AuthService,
    private dataUser: UsersService
  ) {
    super();

    const params: ListParams = {
      'filter.id': this.userService.decodeToken().username.toUpperCase(),
    };

    this.dataUser.getAllSegUsers(params).subscribe({
      next: response => {
        this.delegation = Number(response.data[0].usuario.delegationNumber);
      },
      error: err => {
        console.log(err);
      },
    });

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
        // custom: [
        //   {
        //     name: 'download',
        //     title: '<i class="bi bi-download"></i>',
        //   },
        // ],
      },
      // edit: {
      //   editButtonContent: '<i class="bi bi-clipboard-minus"></i>',
      // },
      hideSubHeader: false,
      columns: {
        select: {
          title: '',
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
        },
        vat: {
          title: 'IVA',
          sort: false,
          filter: {
            type: 'custom',
            component: CustomFilterComponent,
          },
        },
        total: {
          title: 'Total',
          sort: false,
          filter: {
            type: 'custom',
            component: CustomFilterComponent,
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
              folioinvoiceId: () => (searchFilter = SearchFilter.EQ),
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
    this.comerInvoice.getAllSumInvoice(params).subscribe({
      next: resp => {
        this.loading = false;
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
        console.log(resp);

        // this.formFactura.get('importE').patchValue(resp.sumprecioeg);
        // this.formFactura.get('ivaE').patchValue(resp.sumivaeg);
        // this.formFactura.get('totalE').patchValue(resp.sumtotaleg);
        // this.formFactura.get('importI').patchValue(resp.sumprecioing);
        // this.formFactura.get('ivaI').patchValue(resp.sumivaing);
        // this.formFactura.get('totalI').patchValue(resp.sumtotaling);
      },
      error: () => {},
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

  openModal(): void {
    this.modalService.show(FolioModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  async generatePreFacture() {
    let next: number = 0;

    this.dataFilter.load([]);
    this.dataFilter.refresh();
    this.totalItems = 0;

    next = await this.validatePreFactura();

    console.log(next);

    if (next == 1) {
      const { event, idAllotment, iva } = this.form.value;
      const user = this.userService.decodeToken().username.toUpperCase();
      const data = await this.dataFilter.getAll();
      const aux = await this.invoiceGenerate(
        event,
        data[0] ? data[0].eventId : 0,
        idAllotment,
        data[0] ? data[0].batchId : 0,
        event,
        iva,
        idAllotment,
        this.delegation,
        user
      );

      if (aux == 0) {
        //se habre modal verifiacion ususario
      }
    } else {
      this.alert('warning', 'Operación Denegada', '');
    }
  }

  async invoiceGenerate(
    event: number,
    eventId: number,
    batch: number,
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
          event,
          eventId,
          batch,
          batchId,
          ctrlEvent,
          ctrlGenIva,
          ctrlBatch,
          toolbarNoDelegation,
          toolbarUser,
        })
        .pipe(
          map(resp => resp.auxOi),
          catchError(() => of(0))
        )
    );
  }

  async validatePreFactura() {
    const user = this.userService.decodeToken().username.toUpperCase();
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

      this.processMark('FL', 'PREF');

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

  removeInvoice() {
    let aux: number;

    aux = this.validateInvoiceDelete();

    console.log(aux);

    if (aux == 1) {
      this.processMark('EF', 'FOL');
    }

    //ejecutar service paquete elimina folios
  }

  validateInvoiceDelete() {
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
}

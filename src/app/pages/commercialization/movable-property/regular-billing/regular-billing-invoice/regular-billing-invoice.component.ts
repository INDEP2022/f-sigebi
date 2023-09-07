import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ComerDetailInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-dinvocie.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { ParameterInvoiceService } from 'src/app/core/services/ms-parameterinvoice/parameterinvoice.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SeparateFoliosModalComponent } from '../../mass-bill-base-sales/separate-folios-modal/separate-folios-modal.component';
import { REGULAR_GOODS_COLUMN } from './regular-billing-invoice-goods-columns';

@Component({
  selector: 'app-regular-billing-invoice',
  templateUrl: './regular-billing-invoice.component.html',
  styles: [],
})
export class RegularBillingInvoiceComponent extends BasePage implements OnInit {
  show1 = false;

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

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
  settings2 = {
    ...this.settings,
    actions: false,
  };

  @Output() comer: EventEmitter<any> = new EventEmitter(null);
  @Output() formG: EventEmitter<FormGroup> = new EventEmitter();
  @Input() set sum(values: any) {
    if (values) {
      const time = setTimeout(() => {
        this.formFactura.get('importE').patchValue(values.sum5);
        this.formFactura.get('ivaE').patchValue(values.sum3);
        this.formFactura.get('totalE').patchValue(values.sum1);
        this.formFactura.get('importI').patchValue(values.sum6);
        this.formFactura.get('ivaI').patchValue(values.sum4);
        this.formFactura.get('totalI').patchValue(values.sum2);
        clearTimeout(time);
      }, 0);
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
    private dynamicService: DynamicCatalogsService
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
    this.paramsList.getValue()['filter.address'] = `${SearchFilter.EQ}:M`;
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
      ...{ sortBy: 'batchId:ASC' },
    };

    this.loading2 = true;
    this.comerDetInvoice.getAll(params).subscribe({
      next: async resp => {
        this.loading2 = false;
        let sum1: number = 0,
          sum2: number = 0,
          sum3: number = 0,
          sum4: number = 0;
        for (let data of resp.data) {
          const value = await this.postQueryDet({
            cveProdservSat: data.prodservSatKey,
            cveUnidSat: data.unitSatKey,
            noTransferee: data.transfereeNot,
          });

          if (value) {
            data.tuitionMod = data.tuition;
            data.downloadcvman = value.mandato;
            data.desc_unidad_det = value.desc_unidad_det;
            data.desc_producto_det = value.desc_producto_det;
          }

          sum1 = sum1 + Number(data.price);
          sum2 = sum2 + Number(data.vat);
          sum3 = sum3 + Number(data.total);
          sum4 = sum4 + Number(data.amount);
        }

        sum1 = Number(sum1.toFixed(2));
        sum2 = Number(sum2.toFixed(2));
        sum3 = Number(sum3.toFixed(2));
        sum4 = Number(sum4.toFixed(2));

        this.formDetalle.get('count').patchValue(resp.data.length);
        this.formDetalle.get('totalI').patchValue(sum1);
        this.formDetalle.get('totalIva').patchValue(sum2);
        this.formDetalle.get('total').patchValue(sum3);
        this.formDetalle.get('countTotal').patchValue(sum4);
        this.totalItems2 = resp.count;
        this.dataFilter2.load(resp.data);
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
      ...{ sortBy: 'batchId:ASC' },
    };

    this.loading = true;
    this.comerInvoice.getAll(params).subscribe({
      next: resp => {
        this.loading = false;
        this.comer.emit({
          val: resp.data[0].eventId,
          count: resp.count,
          data: resp.data,
          filter: params,
        });
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
        this.formFactura.get('count').patchValue(resp.data.length);
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

  generatePreFacture() {}
  updateData() {}
  generateInvoice() {}
  removeInvoice() {}

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
      iva: [null],
      date: [null],
      causerebillId: [null],
      check: [null],
      delegation: [null],
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
      totalI: [null],
      totalIva: [null],
      total: [null],
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

  openModal(): void {
    const modalRef = this.modalService.show(SeparateFoliosModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
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
        invoice.Type,
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
        catchError(error => of(-1))
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
      this.isSelect[0].Type,
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
        invoice.Type,
        1,
        invoice.eventId,
        invoice.billId,
        invoice.impressionDate
      );
      break;
    }
  }

  actMatricula() {
    if (this.isSelect.length == 0) {
      this.alert('warning', 'Atención', 'Favor de seleccionar una factura');
      return;
    }

    const data = this.isSelect[0];

    if (data.factstatusId == 'PREF') {
    } else {
      this.alert(
        'warning',
        'Atención',
        'Estatus de la Factura inválida para realizar el cambio'
      );
    }
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
}

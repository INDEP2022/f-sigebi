import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { BasePage } from 'src/app/core/shared/base-page';
//XLSX
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { CustomFilterComponent } from 'src/app/@standalone/shared-forms/input-number/input-number';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ComerDetailInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-dinvocie.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { ParameterInvoiceService } from 'src/app/core/services/ms-parameterinvoice/parameterinvoice.service';
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
  formFactura: FormGroup = new FormGroup({});
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
    private comerDetInvoice: ComerDetailInvoiceService
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
              { id: 1, desc: 'Vehiculo' },
              { id: 2, desc: 'Diversos c/Anexo' },
              { id: 3, desc: 'Diversos s/Anexo' },
              { id: 4, desc: 'Aeronaves' },
              { id: 5, desc: 'Chatarra c/Anexo' },
              { id: 6, desc: 'Chatarra s/Anexo' },
              { id: 7, desc: 'Venta de Bases' },
            ];
            return values.filter(m => m.id == val)[0].desc ?? '';
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
      next: resp => {
        this.loading2 = false;
        this.totalItems2 = resp.count;
        this.dataFilter2.load(resp.data);
        this.dataFilter2.refresh();
      },
      error: () => {
        this.loading2 = false;
        this.totalItems2 = 0;
        this.dataFilter2.load([]);
        this.dataFilter2.refresh();
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
      },
      error: () => {
        this.loading = false;
        this.totalItems = 0;
        this.dataFilter.load([]);
        this.dataFilter.refresh();

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
}

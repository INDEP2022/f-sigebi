import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { CustomDateFilterComponent_ } from 'src/app/pages/administrative-processes/numerary/deposit-tokens/deposit-tokens/searchDate';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BillingsService } from '../services/services';
import { COMER_EST_LOTES, INCONSISTENCIAS, INCONSISTENCIAS1 } from './columns';
import { BillingCommunicationService } from './communication/communication.services';
import { DatCancComponent } from './dat-canc/dat-canc.component';
import { UpdateFacturaComponent } from './update-factura/update-factura.component';
@Component({
  selector: 'app-billing-screen',
  templateUrl: './billing-screen.component.html',
  styles: [
    `
      .bg-gray {
        background-color: white !important;
      }

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
export class BillingScreenComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  data3: LocalDataSource = new LocalDataSource();
  data4: LocalDataSource = new LocalDataSource();
  data5: LocalDataSource = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  params5 = new BehaviorSubject<ListParams>(new ListParams());

  totalItems: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  totalItems4: number = 0;
  totalItems5: number = 0;

  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});

  columnFilters: any = [];
  columnFilters2: any = [];
  columnFilters3: any = [];
  columnFilters4: any = [];
  columnFilters5: any = [];

  settings2: any;
  settings3: any;
  settings4: any;
  settings5: any;

  loading2: boolean = false;
  loading3: boolean = false;
  loading4: boolean = false;
  loading5: boolean = false;

  selectedbillings: any[] = [];
  selectedbillingsDet: any[] = [];

  disabledCause: boolean = false;
  disabledDescause: boolean = false;
  disabledRegCanc: boolean = false;

  disabledGenXPays: boolean = true; // GEN_XPAGOS
  disabledUpdate2: boolean = true; // ACTUALIZA2
  disabledGenPreFac100: boolean = true; // GEN_PREFAC_100
  disabledUpdate: boolean = true; // ACTUALIZA

  causeSelect = new DefaultSelect();

  ejec_reg_estat: number = 0; //EJEC_REG_ESTAT
  valDefaultWhere: boolean = false;
  valDefaultWhereInconsistencias: boolean = false;

  billingSelected: any = null;

  get idEventBlkCtrl() {
    return this.form.get('idEvent');
  }

  get idLotPublicBlkCtrl() {
    return this.form.get('idLotPublic');
  }

  get dateBlkCtrl() {
    return this.form.get('date');
  }

  get causeBlkCtrl() {
    return this.form.get('cause');
  }

  @ViewChild('tabB', { static: true }) tabB: ElementRef;
  @ViewChild('myTabset', { static: true }) tabset: TabsetComponent;
  valFiltros: boolean;
  constructor(
    private fb: FormBuilder,
    private msInvoiceService: MsInvoiceService,
    private lotService: LotService,
    private comerEventService: ComerEventService,
    private billingsService: BillingsService,
    private token: AuthService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private billingCommunicationService: BillingCommunicationService,
    private datePipe: DatePipe,
    private excelService: ExcelService
  ) {
    super();

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        delete: false,
        edit: true,
        add: false,
        position: 'right',
      },
      edit: {
        editButtonContent:
          '<i class="fa fa-pencil-alt text-warning mx-2 pl-3"></i>',
        editButtonCallback: (row: any) => {
          console.log('rowrowrow', row);
          // lógica para determinar si el botón de edición debe estar habilitado o deshabilitado para la fila actual
          return row.data.columnName === 'valor habilitado';
        },
      },
      columns: {
        name: {
          filter: false,
          sort: false,
          title: 'Selección',
          type: 'custom',
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: any) =>
            this.isBillingSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onBillingSelect(instance),
        },
        eventId: {
          title: 'Evento',
          type: 'string',
          sort: false,
          width: '10%',
        },
        batchId: {
          title: 'Lote',
          type: 'string',
          sort: false,
          width: '10%',
        },
        vouchertype: {
          title: 'Tipo',
          type: 'string',
          sort: false,
          width: '10%',
        },
        series: {
          title: 'Serie',
          type: 'string',
          sort: false,
          width: '15%',
        },
        impressionDate: {
          title: 'Fecha',
          // type: 'string',
          width: '20%',
          sort: false,
          valuePrepareFunction: (text: string) => {
            return `${
              text ? text.split('T')[0].split('-').reverse().join('/') : ''
            }`;
          },
          filter: {
            type: 'custom',
            component: CustomDateFilterComponent_,
            // component: CustomDateFilterComponent,
          },
          filterFunction(cell?: any, search?: string): boolean {
            let column = cell;
            // console.log(column, '==', search);
            return true;
          },
        },

        factstatusId: {
          title: 'Estatus',
          type: 'string',
          sort: false,
          width: '10%',
        },
        customer: {
          title: 'Cliente',
          type: 'html',
          sort: false,
          width: '30%',
          valuePrepareFunction: (cell: any, row: any, h: any, a: any) => {
            if (!['F', 'M'].includes(row.valRFC)) {
              // 'red-column-fcomer086-I'
              return `<span class="red-column-fcomer086-I" >${cell}</span>`;
            }
            return `<span >${cell}</span>`;
          },
        },
        delegationNumber: {
          title: 'No.',
          type: 'string',
          sort: false,
          width: '10%',
        },
        desDelegation: {
          title: 'Delegación',
          type: 'string',
          sort: false,
          width: '20%',
          filter: false,
        },
        cvman: {
          title: 'Mandato',
          type: 'string',
          sort: false,
        },
        downloadcvman: {
          title: 'Denominación',
          type: 'string',
          sort: false,
        },
        txtDescTipo: {
          title: 'Factura para',
          type: 'string',
          sort: false,
        },
        Invoice: {
          title: 'Folio',
          type: 'string',
          sort: false,
          width: '10%',
        },
        payId: {
          title: 'Id. Pago',
          type: 'string',
          sort: false,
        },
        relationshipSatType: {
          title: 'Tipo Rel.',
          type: 'string',
          sort: false,
        },
        usecompSat: {
          title: 'Uso comp.',
          type: 'string',
          sort: false,
        },
        paymentformBsat: {
          title: 'F. Pago',
          type: 'string',
          sort: false,
        },
        numBiasSat: {
          title: 'Parc.',
          type: 'string',
          sort: false,
        },
      },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        name: {
          filter: false,
          sort: false,
          title: 'Selección',
          type: 'custom',
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: any) =>
            this.isBillingDetSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onBillingDetSelect(instance),
        },
        notGood: {
          title: 'No. Bien',
          type: 'string',
          sort: false,
          width: '10%',
        },
        amount: {
          title: 'Cantidad',
          type: 'html',
          sort: false,
          width: '10%',
          valuePrepareFunction: (amount: string) => {
            const numericAmount = parseFloat(amount);

            if (!isNaN(numericAmount)) {
              const a = numericAmount.toLocaleString('en-US', {
                // style: 'currency',
                // currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              return '<p class="cell_right">' + a + '</p>';
            } else {
              return amount;
            }
          },
          filterFunction(cell?: any, search?: string): boolean {
            return true;
          },
        },
        description: {
          title: 'Descripción',
          type: 'string',
          sort: false,
          width: '30%',
        },
        unit: {
          title: 'Unidad',
          type: 'string',
          sort: false,
          width: '15%',
        },
        amountnoappvat: {
          title: 'Monto Exento',
          type: 'html',
          sort: false,
          width: '10%',
          valuePrepareFunction: (amount: string) => {
            const numericAmount = parseFloat(amount);

            if (!isNaN(numericAmount)) {
              const a = numericAmount.toLocaleString('en-US', {
                // style: 'currency',
                // currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              return '<p class="cell_right">' + a + '</p>';
            } else {
              return amount;
            }
          },
          filterFunction(cell?: any, search?: string): boolean {
            return true;
          },
        },
        amountappsvat: {
          title: 'Monto Gravado',
          type: 'html',
          sort: false,
          width: '10%',
          valuePrepareFunction: (amount: string) => {
            const numericAmount = parseFloat(amount);

            if (!isNaN(numericAmount)) {
              const a = numericAmount.toLocaleString('en-US', {
                // style: 'currency',
                // currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              return '<p class="cell_right">' + a + '</p>';
            } else {
              return amount;
            }
          },
          filterFunction(cell?: any, search?: string): boolean {
            return true;
          },
        },
        vat: {
          title: 'IVA',
          type: 'html',
          sort: false,
          width: '10%',
          valuePrepareFunction: (amount: string) => {
            const numericAmount = parseFloat(amount);

            if (!isNaN(numericAmount)) {
              const a = numericAmount.toLocaleString('en-US', {
                // style: 'currency',
                // currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              return '<p class="cell_right">' + a + '</p>';
            } else {
              return amount;
            }
          },
          filterFunction(cell?: any, search?: string): boolean {
            return true;
          },
        },
        price: {
          title: 'Importe',
          type: 'html',
          sort: false,
          width: '10%',
          valuePrepareFunction: (amount: string) => {
            const numericAmount = parseFloat(amount);

            if (!isNaN(numericAmount)) {
              const a = numericAmount.toLocaleString('en-US', {
                // style: 'currency',
                // currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              return '<p class="cell_right">' + a + '</p>';
            } else {
              return amount;
            }
          },
          filterFunction(cell?: any, search?: string): boolean {
            return true;
          },
        },
        total: {
          title: 'Total',
          type: 'html',
          sort: false,
          width: '10%',
          valuePrepareFunction: (amount: string) => {
            const numericAmount = parseFloat(amount);

            if (!isNaN(numericAmount)) {
              const a = numericAmount.toLocaleString('en-US', {
                // style: 'currency',
                // currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              return '<p class="cell_right">' + a + '</p>';
            } else {
              return amount;
            }
          },
          filterFunction(cell?: any, search?: string): boolean {
            return true;
          },
        },
        downloadcvman: {
          title: 'Mandato',
          type: 'string',
          sort: false,
          width: '10%',
        },
        prodservSatKey: {
          title: 'Prod./Serv.',
          type: 'string',
          sort: false,
          width: '15%',
        },
        unitSatKey: {
          title: 'Unidad',
          type: 'string',
          sort: false,
          width: '10%',
        },
      },
    };

    this.settings3 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...INCONSISTENCIAS,
      },
    };

    this.settings4 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...INCONSISTENCIAS1,
      },
    };

    this.settings5 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COMER_EST_LOTES,
      },
    };
  }

  // ------------ SELECTS DE LA TABLA1 - COMER_FACTURAS ------------ //
  onBillingSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.billingSelectedChange(data.row, data.toggle),
    });
  }
  isBillingSelected(_billing: any) {
    const exists = this.selectedbillings.find(
      (billing: any) =>
        billing.billId == _billing.billId && billing.eventId == _billing.eventId
    );
    return !exists ? false : true;
  }
  billingSelectedChange(billing: any, selected: boolean) {
    if (selected) {
      this.selectedbillings.push(billing);
    } else {
      this.selectedbillings = this.selectedbillings.filter(
        (_billing: any) =>
          _billing.billId != billing.billId &&
          billing.eventId == _billing.eventId
      );
    }
  }

  // ------------ SELECTS DE LA TABLA2 - COMER_DETFACTURAS ------------ //
  onBillingDetSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.billingDetSelectedChange(data.row, data.toggle),
    });
  }
  isBillingDetSelected(_billing: any) {
    const exists = this.selectedbillingsDet.find(
      (billing: any) => billing.billId == _billing.billId
    );
    return !exists ? false : true;
  }
  billingDetSelectedChange(billing: any, selected: boolean) {
    if (selected) {
      this.selectedbillingsDet.push(billing);
    } else {
      this.selectedbillingsDet = this.selectedbillingsDet.filter(
        (_billing: any) => _billing.billId != billing.billId
      );
    }
  }

  ngOnInit(): void {
    this.prepareForm();

    // this.billingCommunicationService.ejecutarFuncion$.subscribe(
    //   (next: any) => {
    //     // console.log('SI WILM', next);
    //     this.ejecutarFuncion();
    //   }
    // );
    // ------------- PREPARAMOS FILTRADOS DE LAS TABLAS ------------- //
    this.filterTable1(); // Facturas - COMER_FACTURAS
    this.filterTable2(); // Detalle de la Factura - COMER_DETFACTURAS
    this.filterTable3(); // Errores y Datos Nulos - COMER_INCONSISTENCIAS
    this.filterTable4(); // Errores al obtener folios de SIRSAE - COMER_INCONSISTENCIAS1
    this.filterTable5(); // Actualización de Eventos - COMER_EST_LOTES
  }

  async cambiarTab(numberTab: any) {
    // Cambia a la pestaña deseada utilizando selectedIndex
    this.tabset.tabs[numberTab].active = true;
  }
  filterTable1() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              eventId: () => (searchFilter = SearchFilter.EQ),
              batchId: () => (searchFilter = SearchFilter.EQ),
              vouchertype: () => (searchFilter = SearchFilter.ILIKE),
              series: () => (searchFilter = SearchFilter.EQ),
              Invoice: () => (searchFilter = SearchFilter.ILIKE),
              factstatusId: () => (searchFilter = SearchFilter.ILIKE),
              customer: () => (searchFilter = SearchFilter.EQ),
              delegationNumber: () => (searchFilter = SearchFilter.EQ),
              desDelegation: () => (searchFilter = SearchFilter.ILIKE),
              cvman: () => (searchFilter = SearchFilter.EQ),
              downloadcvman: () => (searchFilter = SearchFilter.EQ),
              txtDescTipo: () => (searchFilter = SearchFilter.ILIKE),
              impressionDate: () => (searchFilter = SearchFilter.EQ),
              payId: () => (searchFilter = SearchFilter.EQ),
              relationshipSatType: () => (searchFilter = SearchFilter.EQ),
              usecompSat: () => (searchFilter = SearchFilter.EQ),
              paymentformBsat: () => (searchFilter = SearchFilter.ILIKE),
              numBiasSat: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              // this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getBillings();
        }
      });

    // this.params
    //   .pipe(
    //     skip(1),
    //     tap(() => { // aquí colocas la función que deseas ejecutar
    //       this.getBillings();
    //     }),
    //     takeUntil(this.$unSubscribe)
    //   )
    //   .subscribe(() => {
    //   });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBillings());
  }
  filterTable2() {
    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              notGood: () => (searchFilter = SearchFilter.EQ),
              amount: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              unit: () => (searchFilter = SearchFilter.EQ),
              amountnoappvat: () => (searchFilter = SearchFilter.EQ),
              amountappsvat: () => (searchFilter = SearchFilter.EQ),
              vat: () => (searchFilter = SearchFilter.EQ),
              price: () => (searchFilter = SearchFilter.EQ),
              total: () => (searchFilter = SearchFilter.EQ),
              downloadcvman: () => (searchFilter = SearchFilter.ILIKE),
              prodservSatKey: () => (searchFilter = SearchFilter.ILIKE),
              unitSatKey: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          //Su respectivo metodo de busqueda de datos
          this.getDetailsFacturas();
        }
      });
    this.params
      .pipe(
        skip(1),
        tap(() => {
          // aquí colocas la función que deseas ejecutar
          this.getDetailsFacturas();
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
    // this.params2
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getDetailsFacturas());
  }
  filterTable3() {
    this.data3
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              eventId: () => (searchFilter = SearchFilter.EQ),
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              batchPublic: () => (searchFilter = SearchFilter.EQ),
              downloadMistake: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters3[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters3[field];
            }
          });
          this.params3 = this.pageFilter(this.params3);
          //Su respectivo metodo de busqueda de datos
          this.getInconsistencies_();
        }
      });
    this.params3
      .pipe(
        skip(1),
        tap(() => {
          // aquí colocas la función que deseas ejecutar
          this.getInconsistencies_();
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
    // this.params3
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getInconsistencies_());
  }
  filterTable4() {
    this.data4
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              eventId: () => (searchFilter = SearchFilter.EQ),
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              batchPublic: () => (searchFilter = SearchFilter.EQ),
              downloadMistake: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters4[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters4[field];
            }
          });
          this.params4 = this.pageFilter(this.params4);
          //Su respectivo metodo de busqueda de datos
          this.getInconsistencies_1();
        }
      });
    this.params4
      .pipe(
        skip(1),
        tap(() => {
          // aquí colocas la función que deseas ejecutar
          this.getInconsistencies_1();
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
    // this.params4
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getInconsistencies_1());
  }
  filterTable5() {
    this.data5
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              idEvent: () => (searchFilter = SearchFilter.EQ),
              lotPublic: () => (searchFilter = SearchFilter.EQ),
              status: () => (searchFilter = SearchFilter.ILIKE),
              statusAnt: () => (searchFilter = SearchFilter.ILIKE),
              changeDate: () => (searchFilter = SearchFilter.EQ),
              changeReason: () => (searchFilter = SearchFilter.ILIKE),
              changeType: () => (searchFilter = SearchFilter.EQ),
              user: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters5[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters5[field];
            }
          });
          this.params5 = this.pageFilter(this.params5);
          //Su respectivo metodo de busqueda de datos
          this.getEatEstLot();
        }
      });
    this.params5
      .pipe(
        skip(1),
        tap(() => {
          // aquí colocas la función que deseas ejecutar
          this.getEatEstLot();
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
    // this.params5
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getEatEstLot());
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: [null, Validators.pattern(NUMBERS_PATTERN)],
      idLotPublic: [null],
      date: [null],
      cause: [null],
      descause: [null],
      fec: [null],
      fec2: [null],
    });
    this.form2 = this.fb.group({
      counter: [null],
      counter2: [null],

      order: [null],
      xLote: [null],

      amountE: [null],
      amountI: [null],

      ivaE: [null],
      ivaI: [null],

      totalE: [null],
      totalI: [null],

      total8: [null],
      total7: [null],
      total3: [null],

      txtErrorRFC: [null],
      legend1: [null],

      amountPay: [null],
      ivaPay: [null],
      totalPay: [null],
    });
  }
  async getBillings() {
    // Facturas - COMER_FACTURAS
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    if (params['filter.impressionDate']) {
      const fechas = params['filter.impressionDate'].split(',');
      console.log('fechas', fechas);
      var fecha1 = new Date(fechas[0]);
      var fecha2 = new Date(fechas[1]);

      // Obtener los componentes de la fecha (año, mes y día)
      var ano1 = fecha1.getFullYear();
      var mes1 = ('0' + (fecha1.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var dia1 = ('0' + fecha1.getDate()).slice(-2);

      // Obtener los componentes de la fecha (año, mes y día)
      var ano2 = fecha2.getFullYear();
      var mes2 = ('0' + (fecha2.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var dia2 = ('0' + fecha2.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada1 = ano1 + '-' + mes1 + '-' + dia1;
      var fechaFormateada2 = ano2 + '-' + mes2 + '-' + dia2;
      params[
        'filter.impressionDate'
      ] = `$btw:${fechaFormateada1},${fechaFormateada2}`;
    }

    if (this.valDefaultWhere)
      params['filter.eventId'] = `$eq:${this.idEventBlkCtrl.value}`;

    params['filter.address'] = `$eq:I`;
    if (!this.valSortBy) params['sortBy'] = `eventId:DESC`;
    this.msInvoiceService.getAllBillings(params).subscribe({
      next: response => {
        console.log(response);

        let result = response.data.map(async (item: any) => {
          const params = new ListParams();
          params['filter.id'] = `$eq:${item.delegationNumber}`;
          const delegationDes: any = await this.billingsService.getDelegation(
            params
          );
          item['desDelegation'] = !delegationDes
            ? null
            : delegationDes.description;

          const params_ = new ListParams();
          params['filter.tpinvoiceId'] = `$eq:${item.Type}`;
          const comerTpinvoice: any =
            await this.billingsService.getComerTpinvoices(params_);
          item['txtDescTipo'] = comerTpinvoice
            ? comerTpinvoice.description
            : 'NO IDENTIFICADA';
          let obj = {
            type: 'RFC',
            data: item.rfc,
          };
          const FaValidCurpRfc: any =
            await this.billingsService.getApplicationFaValidCurpRfc(obj);
          item['valRFC'] = FaValidCurpRfc ? FaValidCurpRfc : null;

          let obj_ = {
            idEvent: item.eventId,
            idBill: item.billId,
          };
          const total = await this.getBillsTotal(item, obj_);
          item['totaling'] = total.totaling;
          item['totaleg'] = total.totaleg;
          const vat = await this.getBillsIva(item, obj_);
          item['ivaing'] = vat.ivaing;
          item['ivaeg'] = vat.ivaeg;
          const price = await this.getBillsPrice(item, obj_);
          item['priceing'] = price.priceing;
          item['priceeg'] = price.priceeg;
        });
        Promise.all(result).then(async resp => {
          await this.funcPriceVatTotal(response.data[0]);
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
        });
      },
      error: error => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  async getDetailsFacturas() {
    // Detalle de la Factura - COMER_DETFACTURAS
    this.loading2 = true;
    this.totalItems2 = 0;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };

    this.msInvoiceService.getComerCetinvoices(params).subscribe({
      next: response => {
        console.log(response);

        // let result = response.data.map(async (item: any) => {
        //   // item['rfc'] = item.customers ? item.customers.rfc : null;
        // });
        // Promise.all(result).then(resp => {
        this.data2.load(response.data);
        this.data2.refresh();
        this.totalItems2 = response.count;
        this.loading2 = false;
        // });
      },
      error: error => {
        this.data2.load([]);
        this.data2.refresh();
        this.totalItems2 = 0;
        this.loading2 = false;
      },
    });
  }

  async getInconsistencies_() {
    // Errores y Datos Nulos - COMER_INCONSISTENCIAS
    this.loading3 = true;
    this.totalItems3 = 0;
    let params = {
      ...this.params3.getValue(),
      ...this.columnFilters3,
    };
    params['filter.downloadMistake'] = `$not:$ilike:ERROR_FOLIO`;
    if (this.valDefaultWhereInconsistencias)
      params['filter.eventId'] = `$eq:${this.idEventBlkCtrl.value}`;
    this.msInvoiceService.getInconsistencies_(params).subscribe({
      next: response => {
        console.log(response);
        this.data3.load(response.data);
        this.data3.refresh();
        this.totalItems3 = response.count;
        this.loading3 = false;
      },
      error: error => {
        this.data3.load([]);
        this.data3.refresh();
        this.totalItems3 = 0;
        this.loading3 = false;
      },
    });
  }

  async getInconsistencies_1() {
    // Errores al obtener folios de SIRSAE - COMER_INCONSISTENCIAS1
    this.loading4 = true;
    this.totalItems4 = 0;
    let params = {
      ...this.params4.getValue(),
      ...this.columnFilters4,
    };
    params['filter.downloadMistake'] = `$ilike:ERROR_FOLIO`;
    this.msInvoiceService.getInconsistencies_(params).subscribe({
      next: response => {
        console.log(response);
        this.data4.load(response.data);
        this.data4.refresh();
        this.totalItems4 = response.count;
        this.loading4 = false;
      },
      error: error => {
        this.data4.load([]);
        this.data4.refresh();
        this.totalItems4 = 0;
        this.loading4 = false;
      },
    });
  }

  async getEatEstLot() {
    // Actualización de Eventos - COMER_EST_LOTES
    this.loading5 = true;
    this.totalItems5 = 0;
    let params = {
      ...this.params5.getValue(),
      ...this.columnFilters5,
    };

    if (params['filter.changeDate']) {
      var fecha = new Date(params['filter.changeDate']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params['filter.changeDate'] = `$eq:${fechaFormateada}`;
      // delete params['filter.date'];
    }

    this.lotService.getEatEstLot(params).subscribe({
      next: response => {
        console.log(response);
        this.data5.load(response.data);
        this.data5.refresh();
        this.totalItems5 = response.count;
        this.loading5 = false;
      },
      error: error => {
        this.data5.load([]);
        this.data5.refresh();
        this.totalItems5 = 0;
        this.loading5 = false;
      },
    });
  }

  async funcPriceVatTotal(factura: any) {
    let obj = {
      idEvent: factura.eventId,
      idBill: factura.billId,
    };
    if ([10, 11].includes(factura.Type)) {
      const enterAmountInputs: any =
        await this.billingsService.getApplicationComerBillsAmount(obj);
      if (!enterAmountInputs) {
        this.form2.get('amountPay').setValue(null);
        this.form2.get('ivaPay').setValue(null);
        this.form2.get('totalPay').setValue(null);
      } else {
        this.form2.get('amountPay').setValue(enterAmountInputs.paymentAmount);
        this.form2.get('ivaPay').setValue(enterAmountInputs.ivaAmount);
        this.form2.get('totalPay').setValue(enterAmountInputs.totalPayment);
      }
    }
  }

  async getBillsTotal(factura: any, obj: any) {
    let objReturn = {
      totaling: 0,
      totaleg: 0,
    };
    if (factura.vouchertype != 'NCR' && !factura.total) {
      const enterBillTotal: any =
        await this.billingsService.getApplicationComerBillsTotal(obj);
      objReturn.totaling = enterBillTotal.totaling;
      objReturn.totaleg = enterBillTotal.totaleg;
    } else if (factura.vouchertype != 'NCR' && factura.total) {
      objReturn.totaling = factura.total;
      objReturn.totaleg = 0;
    } else if (factura.vouchertype == 'NCR' && !factura.total) {
      const enterBillTotal: any =
        await this.billingsService.getApplicationComerBillsTotal(obj);
      objReturn.totaling = enterBillTotal.totaling;
      objReturn.totaleg = enterBillTotal.totaleg;
    } else if (factura.vouchertype == 'NCR' && factura.total) {
      objReturn.totaling = 0;
      objReturn.totaleg = factura.total;
    }
    return objReturn;
  }

  async getBillsIva(factura: any, obj: any) {
    let objReturn = {
      ivaing: 0,
      ivaeg: 0,
    };
    if (factura.vouchertype != 'NCR' && !factura.vat) {
      const enterBillTotal: any =
        await this.billingsService.getApplicationComerBillsIva(obj);
      objReturn.ivaing = enterBillTotal.ivaing;
      objReturn.ivaeg = enterBillTotal.ivaeg;
    } else if (factura.vouchertype != 'NCR' && factura.vat) {
      objReturn.ivaing = factura.vat;
      objReturn.ivaeg = 0;
    } else if (factura.vouchertype == 'NCR' && !factura.vat) {
      const enterBillTotal: any =
        await this.billingsService.getApplicationComerBillsIva(obj);
      objReturn.ivaing = enterBillTotal.ivaing;
      objReturn.ivaeg = enterBillTotal.ivaeg;
    } else if (factura.vouchertype == 'NCR' && factura.vat) {
      objReturn.ivaing = 0;
      objReturn.ivaeg = factura.vat;
    }
    return objReturn;
  }

  async getBillsPrice(factura: any, obj: any) {
    let objReturn = {
      priceing: 0,
      priceeg: 0,
    };
    if (factura.vouchertype != 'NCR' && !factura.price) {
      const enterBillTotal: any =
        await this.billingsService.getApplicationComerBillsPrice(obj);
      objReturn.priceing = enterBillTotal.priceing;
      objReturn.priceeg = enterBillTotal.ivaeg;
    } else if (factura.vouchertype != 'NCR' && factura.price) {
      objReturn.priceing = factura.price;
      objReturn.priceeg = 0;
    } else if (factura.vouchertype == 'NCR' && !factura.price) {
      const enterBillTotal: any =
        await this.billingsService.getApplicationComerBillsPrice(obj);
      objReturn.priceing = enterBillTotal.priceing;
      objReturn.priceeg = enterBillTotal.ivaeg;
    } else if (factura.vouchertype == 'NCR' && factura.price) {
      objReturn.priceing = 0;
      objReturn.priceeg = factura.price;
    }
    return objReturn;
  }

  rowsSelected(event: any) {
    console.log('event', event);
    console.log('this.data', this.data);
    this.billingSelected = event.data;

    if (!['F', 'M'].includes(this.billingSelected.valRFC)) {
      // : COMER_FACTURAS.TXT_ERROR_RFC := : COMER_FACTURAS.RFC || '->' || c_RESUL;
      const txt = `${this.billingSelected.rfc} -> ${this.billingSelected.valRFC}`;
      this.form2.get('txtErrorRFC').setValue(txt);
    }
  }

  async genPrefacHundred() {
    // Prefacturar Fallo - GEN_PREFAC_100
    const eventId = this.idEventBlkCtrl.value;
    const lotPublic = !this.form.get('idLotPublic').value
      ? null
      : this.form.get('idLotPublic').value;
    console.log('this.idEventBlkCtrl', this.idEventBlkCtrl.value);

    if (!eventId)
      return (
        this.form.get('idEvent').markAsTouched(),
        this.alert('warning', 'Debe ingresar el No. Evento', '')
      );

    const dataEvent: any = await this.billingsService.getEventDataById(eventId);

    if (!dataEvent)
      return this.alert('warning', 'No se encontró el evento, verifique', '');
    if (dataEvent.statusVtaId != 'VEN')
      return this.alert(
        'warning',
        'El estatus del evento no es correcto, verifique',
        ''
      );

    const obj: any = {
      idEvent: eventId,
      idLotPub: !lotPublic ? null : lotPublic,
      formKey: 'FCOMER086_I',
    };

    let counter: any = await this.billingsService.getApplicationLotCounter(obj);
    console.log('counter', counter);
    if (counter == 0)
      return this.alert(
        'warning',
        'No se encontraron lotes con estatus válidos para facturar, verifique',
        ''
      );

    const obj2: any = {
      idEvent: eventId,
      idLotPub: lotPublic,
    };

    counter = await this.billingsService.getApplicationBugInfoCounter(obj2);
    if (counter == 0)
      return this.alert(
        'warning',
        'No se encontraron lotes para facturar, verifique',
        ''
      );

    const obj3: any = {
      idEvent: eventId,
      idLotPub: lotPublic,
    };

    const count_noFact: any =
      await this.billingsService.getApplicationNofactCounter(obj3);
    if (count_noFact > 0)
      return this.alert(
        'warning',
        `No se generan ${count_noFact} facturas por Mandatos no facturables`,
        ''
      );

    const obj4: any = {
      idEvent: eventId,
      idLotPub: lotPublic,
    };

    const counter1: any = await this.billingsService.getApplicationCounter1(
      obj4
    );
    if (counter <= counter1)
      return this.alert(
        'warning',
        `La Facturación está completa (${counter1} facturas generadas)`,
        ''
      );

    this.alertQuestion(
      'question',
      `Se generarán ${Number(counter) - Number(counter1)} facturas`,
      '¿Desea ejecutar el proceso?'
    ).then(async question => {
      if (question.isConfirmed) {
        let obj: any = {
          p_id_evento: eventId,
          p_opcion: 0,
          p_lote_publico: !lotPublic ? null : lotPublic,
          p_cve_pantalla: 'FCOMER086_I',
          p_id_factura: null,
          p_id_pago: null,
          p_documento: 'FAC',
          p_secdoc: 'P',
          p_ind_gendet: 1,
          p_no_delegacion: null,
          p_mandato: null,
          p_parcialidad: null,
        };
        const newBillingPay: any = await this.billingsService.paNewBillingPay(
          obj
        ); // EDWIN - CORRECCIÓN
        if (!newBillingPay)
          return this.alert(
            'error',
            `Ha ocurrido un error`,
            'Verifique e intente nuevamente'
          );

        const params = new FilterParams();
        params.addFilter('idEvent', eventId, SearchFilter.EQ);
        const v_process: any = await this.billingsService.getEatEstLot(obj);
        if (v_process == null)
          return this.alert(
            'error',
            `Ha ocurrido un error`,
            'Verifique e intente nuevamente'
          );
        if (v_process.count > 0 && this.ejec_reg_estat == 1) {
          const pupActStatusBatch: any =
            await this.billingsService.pupActStatusBatch(obj); // PUP_ACTESTATUS_LOTE( : BLK_CTRL.ID_EVENTO);
          if (pupActStatusBatch == null)
            return this.alert(
              'error',
              `Ha ocurrido un error`,
              'Verifique e intente nuevamente'
            );
          this.ejec_reg_estat = 0;
        }
        const c_result = newBillingPay;
        if (c_result == 'Correcto.') {
          this.valDefaultWhere = true;
          await this.getBillings(); // GO_BLOCK('COMER_FACTURAS');
          await this.visualProcess(0, 1); // VISUALIZA_PROCESO(0, 1);

          this.alert('success', 'Proceso terminado correctamente', '');
        } else {
          this.alert('warning', c_result, '');
        }
      }
    });
  }

  async visualProcess(act: number, button: number) {
    // VISUALIZA_PROCESO(0, 1);

    if (button == 1) {
      if (act == 1) {
        this.disabledGenXPays = true;
        this.disabledUpdate2 = true;
      } else if (act == 0) {
        //     GO_ITEM('BLK_CTRL.ID_EVENTO');
        this.disabledGenXPays = true;
        this.disabledUpdate2 = true;
      }
    } else if (button == 2) {
      if (act == 1) {
        this.disabledGenPreFac100 = true;
        this.disabledUpdate = true;
      } else if (act == 0) {
        //     GO_ITEM('BLK_CTRL.ID_EVENTO');
        this.disabledGenPreFac100 = false;
        this.disabledUpdate = false;
      }
    }
  }

  update() {
    // Act Datos Fallo - ACTUALIZA
    this.pupActData('F'); // PUP_ACT_DATOS ('F')
  }

  async pupActData(c_TIPO: string) {
    //  PUP_ACT_DATOS
    // GO_BLOCK('COMER_FACTURAS');
    let n_OPCION: any = null;
    let c_SECDOC: any = null;
    if (!(await this.valBillingsSelects()))
      return this.alert(
        'warning',
        'No hay facturas seleccionadas para procesar',
        ''
      );
    let obj = {
      pUser: this.token.decodeToken().username,
      pAddress: 'I',
    };
    const fValidateUser: any = await this.billingsService.getFValidateUser(obj); // PK_COMER_FACTINM.F_VALIDA_USUARIO

    if (fValidateUser != 1)
      return this.alert(
        'warning',
        'Usuario inválido para realizar el proceso.',
        ''
      );
    const obj___: any = {
      parameter: 'SUPUSUFACTR',
      value: this.token.decodeToken().username,
      address: 'I',
    };
    const c_Reg: any = await this.billingsService.pufUsuReg(obj___); // PUF_USU_REG;

    if (this.selectedbillings.length == 0)
      return this.alert('warning', 'No hay facturas seleccionadas', '');
    let cont = 0;
    let arr: any[] = [];
    let result = this.selectedbillings.map(item => {
      if (
        (item.factstatusId === 'PREF' &&
          item.vouchertype == 'FAC' &&
          c_TIPO == 'F' &&
          (item.Type === 8 || item.Type === 9)) ||
        (c_TIPO == 'P' && (item.Type === 10 || item.Type === 11))
      ) {
        if (c_Reg == 'S') {
          if (item.delegationNumber == this.token.decodeToken().department) {
            cont = cont + 1;
            arr.push(item);
          }
        } else {
          arr.push(item);
          cont = cont + 1;
        }
      }
    });
    Promise.all(result).then(resp => {
      if (cont == 0)
        return this.alert('warning', 'No se tienen facturas a procesar', '');
      this.selectedbillings = arr;
      this.data.refresh();
      this.alertQuestion(
        'question',
        `Se actualizarán ${cont} facturas`,
        '¿Desea ejecutar el proceso?'
      ).then(async question => {
        if (question.isConfirmed) {
          if (c_TIPO == 'F') {
            n_OPCION = 0;
            c_SECDOC = 'P';
          } else {
            n_OPCION = 1;
            c_SECDOC = 'S';
          }
          let result = this.selectedbillings.map(async item => {
            // COMER_CTRLFACTURA.REGXLOTE
            let obj_1 = {
              eventId: item.eventId,
              lotId: item.lotId,
            };
            await this.billingsService.comerCtrFacRegxBatch(obj_1);

            // PK_COMER_FACTINM.PA_NVO_ELIMINA_FACTURA
            let obj_2 = {
              pEventId: item.eventId,
              pInvoiceId: item.billId,
            };
            let c_RESUL: any = await this.billingsService.getPaNvoDeleteInvoice(
              obj_2
            );

            if (c_RESUL != 'Correcto.') {
              this.alert(
                'warning',
                c_RESUL,
                `Para Evento: ${item.eventId}, Lote: ${item.lotId}, Del.: ${item.delegationNumber}, Mandato.:${item.cvman}`
              );
            } else {
              let obj: any = {
                p_id_evento: item.eventId,
                p_opcion: n_OPCION,
                p_lote_publico: item.lotId,
                p_cve_pantalla: 'FCOMER086_I',
                p_id_factura: item.billId,
                p_id_pago: item.paymentId,
                p_documento: 'FAC',
                p_secdoc: c_SECDOC,
                p_ind_gendet: 1,
                p_no_delegacion: item.delegationNumber,
                p_mandato: item.cvman,
                p_parcialidad: item.numBiasSat,
              };
              // PK_COMER_FACTINM.PA_NVO_FACTURA_PAG
              const newBillingPay: any =
                await this.billingsService.paNewBillingPay(obj); // EDWIN - CORRECCIÓN

              if (newBillingPay != 'Correcto.') {
                this.alert(
                  'warning',
                  newBillingPay,
                  `Para Evento: ${item.eventId}, Lote: ${item.lotId}, Del.: ${item.delegationNumber}, Mandato.:${item.cvman}`
                );
              }
            }
          });
          Promise.all(result).then(async resp_ => {
            this.valDefaultWhere = true;
            await this.getBillings(); // GO_BLOCK('COMER_FACTURAS');
            this.alert('success', 'Proceso terminado correctamente', '');
          });
        }
      });
    });
  }

  VISUALIZA() {
    // Visualiza Factura
    //   IF: COMER_FACTURAS.ID_EVENTO IS NULL THEN
    //   LIP_MENSAJE('Debe seleccionar algún Evento', 'A');
    //     RAISE FORM_TRIGGER_FAILURE;
    //   ELSE
    //   IMPRIME_REPORTE(: COMER_FACTURAS.TIPO, 2, NULL, 1);
    //     : COMER_FACTURAS.SELECCIONA := 'N';
    //  END IF;
  }

  CANCELA() {
    // Cancelar Factura
    // BEGIN
    //   IF: BLK_CTRL.CAUSA IS NULL THEN
    //   VISUALIZA_CANCELA_SINO(1); --muestras los campos de la causa
    //   GO_ITEM('BLK_CTRL.CAUSA');
    //   ELSE
    //   : BLK_DAT_CANC.ID_EVENTO := NULL;
    //     : BLK_DAT_CANC.TXT_CVE_PROCESO := NULL;
    //     : BLK_DAT_CANC.ID_LOTE := NULL;
    //     : BLK_DAT_CANC.TXT_DESC_LOTE := NULL;
    //     : BLK_DAT_CANC.NO_DELEGACION := NULL;
    //     : BLK_DAT_CANC.TXT_DELEGACION := NULL;
    //     : BLK_DAT_CANC.CVMAN := NULL;
    //     : BLK_DAT_CANC.TXT_CVMAN := NULL;
    //   GO_ITEM('BLK_DAT_CANC.ID_EVENTO');
    // END IF;
    //   END;
  }

  regCanc() {
    // REGCANC
    this.visualCancelYesNot(0);
  }
  visualCancelYesNot(pYesNo: number) {
    // VISUALIZA_CANCELA_SINO

    if (pYesNo == 1) {
      this.disabledCause = true;
      this.disabledDescause = true;
      this.disabledRegCanc = true;
    } else if (pYesNo == 0) {
      this.disabledCause = false;
      this.disabledDescause = false;
      this.disabledRegCanc = false;
      this.form.get('cause').setValue(null);
      this.form.get('descause').setValue(null);
    }
  }

  CFDI() {
    // Genera CFDI

    if (this.selectedbillings.length == 0)
      return this.alert('warning', 'No se tienen facturas seleccionadas.', '');
    //  THEN-- VA AL LINK DE PARA GENERAR LOS XML Y SELLO
    //  Host(FA_URLWEB_FAC(: COMER_FACTURAS.ID_EVENTO), NO_SCREEN);
  }

  async faile() {
    // Actualiza a VEN - FALLO
    if (!this.idEventBlkCtrl)
      return (
        this.form.get('idEvent').markAsTouched(),
        this.alert('warning', 'Debe ingresar el No. Evento', '')
      );

    const dataEvent: any = await this.billingsService.getEventDataById(
      this.idEventBlkCtrl.value
    );
    if (!dataEvent)
      return this.alert('warning', 'No se encontró el evento ingresado', '');

    const params = new ListParams();
    params['filter.eventId'] = `$eq:${this.idEventBlkCtrl.value}`;
    const countFacturas: any = await this.billingsService.getBillings(params);
    if (countFacturas.count == 0) {
      this.alertQuestion(
        'question',
        'Se realiza la actualización de todos los lotes en estatus PAG, PAGE a estatus VEN',
        '¿Se ejecuta el proceso?'
      ).then(async question => {
        if (question.isConfirmed) {
          const params_ = new ListParams();
          params_['filter.eventId'] = `$eq:${this.idEventBlkCtrl.value}`;
          params_['filter.idStatusVta'] = `$in:PAG,PAGE`;
          const countLotes: any = await this.billingsService.getLots(params_);
          if (countLotes.count == 0)
            return this.alert('warning', 'No hay lotes para procesar', '');
          let obj__ = {
            idEvent: this.idEventBlkCtrl.value,
            vThisEvent: dataEvent.statusVtaId,
          };
          const procFailed: any = await this.billingsService.getProcFailed(
            obj__
          );
          if (!procFailed)
            return this.alert(
              'error',
              'Ocurrió un error al intentar procesar los lotes',
              ''
            );
          if (countLotes.count > 0) this.ejec_reg_estat = 1;

          this.alert(
            'success',
            `${countLotes.count} registro (s)  Procesado(os)`,
            ''
          );
        }
      });
    } else {
      if (!this.idLotPublicBlkCtrl)
        return (
          this.form.get('idLotPublic').markAsTouched(),
          this.alert(
            'warning',
            'No es posible actualizar todo el evento',
            'Ingrese el lote a actualizar'
          )
        );

      let obj__ = {
        idEvent: this.idEventBlkCtrl.value,
        idLotPub: this.idLotPublicBlkCtrl.value,
      };
      const consFailed: any = await this.billingsService.getConsFailed(obj__);
      if (!consFailed)
        return this.alert('error', 'Ha ocurrido un error, verifique', '');
      if (consFailed.vexisfact > 0)
        return (
          this.form.get('idEvent').markAsTouched(),
          this.alert(
            'warning',
            'El lote ya cuenta con una factura del 100% trabajada o el estatus no es el esperado',
            ''
          )
        );

      this.alertQuestion(
        'question',
        'Se realiza la actualización de todos los lotes en estatus PAG, PAGE a estatus VEN',
        '¿Se ejecuta el proceso?'
      ).then(async question => {
        if (question.isConfirmed) {
          // ESPERANDO CORRECCIÓN DE EDWIN PARA EL ENDPOINT //
          const params_ = new ListParams();
          params_['filter.eventId'] = `$eq:${this.idEventBlkCtrl.value}`;
          params_['filter.idStatusVta'] = `$in:PAG,PAGE`;
          const countLotes: any = await this.billingsService.getLots(params_);
          if (countLotes.count == 0)
            return this.alert('warning', 'No hay lotes para procesar', '');
          let obj__ = {
            idEvent: this.idEventBlkCtrl.value,
            vThisEvent: dataEvent.statusVtaId,
          };
          const procFailed: any = await this.billingsService.getProcFailed(
            obj__
          );
          if (!procFailed)
            return this.alert(
              'error',
              'Ocurrió un error al intentar procesar los lotes',
              ''
            );
          if (countLotes.count > 0) this.ejec_reg_estat = 1;

          this.alert(
            'success',
            `${countLotes.count} registro(s)  Procesado(os)`,
            ''
          );
        }
      });
    }
  }

  deleteFact() {
    // Rest. Todos - ELIMINAFACT

    this.disabledGenXPays = true;
    this.disabledUpdate2 = true;
    this.disabledGenPreFac100 = true;
    this.disabledUpdate = true;
  }

  deleteSelect() {
    // Elimina x Selección - ELIMINAXSEL
    this.pupEminFact();
  }

  async pupEminFact() {
    // PUP_EMIN_FACT
    if (!(await this.valBillingsSelects()))
      return this.alert('warning', 'No se tienen facturas a procesar.', '');

    let obj = {
      pUser: this.token.decodeToken().username,
      pAddress: 'I',
    };
    const fValidateUser: any = await this.billingsService.getFValidateUser(obj); // PK_COMER_FACTINM.F_VALIDA_USUARIO

    if (fValidateUser != 1)
      return this.alert(
        'warning',
        'Usuario inválido para realizar el proceso.',
        ''
      );

    const obj_: any = {
      parameter: 'SUPUSUFACTR',
      value: this.token.decodeToken().username,
      address: 'I',
    };
    const c_Reg: any = await this.billingsService.pufUsuReg(obj_); // PUF_USU_REG;
    let cont = 0;
    let result = this.selectedbillings.map(async item => {
      if (item.factstatusId == 'PREF' && item.vouchertype == 'FAC') {
        let obj = {
          idEvent: item.eventId,
          delegationNumber: item.delegationNumber,
          cvman: item.cvman,
          idLot: item.batchId,
        };
        const fact =
          await this.billingsService.getApplicationConsPupEminFactFunct(obj);
        if (item.numBiasSat == fact) {
          if (c_Reg == 'S') {
            if (item.delegationNumber == this.token.decodeToken().department) {
              cont = cont + 1;
            }
          } else {
            cont = cont + 1;
          }
        } else {
          this.alert(
            'warning',
            'No se puede eliminar por no ser la última factura generada',
            ''
          );
        }
      }
    });

    Promise.all(result).then(item => {
      if (cont == 0)
        this.alert('warning', 'No se tienen Facturas a procesar.', '');
      this.alertQuestion(
        'question',
        `Se eliminarán ${cont} factura(s)`,
        '¿Desea ejecutar el proceso?'
      ).then(async question => {
        if (question.isConfirmed) {
          let result_ = this.billingSelected.map(async (item: any) => {
            let obj_1 = {
              eventId: item.eventId,
              lotId: item.lotId,
            };
            await this.billingsService.comerCtrFacRegxBatch(obj_1);

            // PK_COMER_FACTINM.PA_NVO_ELIMINA_FACTURA
            let obj_2 = {
              pEventId: item.eventId,
              pInvoiceId: item.billId,
            };
            let c_RESUL: any = await this.billingsService.getPaNvoDeleteInvoice(
              obj_2
            ); //

            if (c_RESUL != 'Correcto.') {
              this.alert(
                'warning',
                c_RESUL,
                `Para Evento: ${item.eventId}, Lote: ${item.lotId}, Del.: ${item.delegationNumber}, Mandato.:${item.cvman}`
              );
            }
          });

          Promise.all(result_).then(resp => {
            // this.valDefaultWhere = true;
            this.getBillings();
            this.alert('success', 'Proceso terminado correctamente', '');
          });
        }
      });
    });
  }

  /** Validación de facturas seleccionadas para procesar **/
  async valBillingsSelects() {
    const result = this.data.getElements().then(item => {
      if (item.length == 0) return false;
      if (!item[0].eventId) return false;
      return true;
    });
    return result;
  }

  async getCauses(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    const causes: any = await this.billingsService.getParamterMod(
      params.getParams()
    );
    if (!causes) {
      this.causeSelect = new DefaultSelect();
    } else {
      this.causeSelect = new DefaultSelect(causes.data, causes.count);
    }
    // select parametro, descripcion
    // from comer_parametrosmod
    // where  valor = 'CAN_FACT_INM'
    // order by parametro
  }

  setValuesCause(event: any) {}

  async visualBilling() {
    if (!(await this.valBillingsSelects()))
      return this.alert('warning', 'Debe seleccionar algún evento.', '');

    if (!this.billingSelected)
      return this.alert(
        'warning',
        'Debe seleccionar una factura para visualizar.',
        ''
      );
    await this.imprimeReport(this.billingSelected.Type, 2, null, 1);
    let arr: any[] = [];
    let result = this.selectedbillings.map(item => {
      if (item == this.billingSelected) return;
      arr.push(item);
    });
    Promise.all(result).then(item => {
      this.selectedbillings = arr;
      this.data.refresh();
    });
  }

  async imprimeReport(pType: any, pMode: any, pSubType: any, pCopies: any) {
    let v_dispositive: string = '';
    let v_image: number;
    let reportName: string = '';
    if (pMode == 1) {
      // --SE ENVIA DIRECTO A IMPRESORA
      v_dispositive = 'PRINTER';
      v_image = 1;
    } else if (pMode == 2) {
      // -- VA A PANTALLA Y NO SE IMPRIME LA IMAGEN
      v_dispositive = 'SCREEN';
      v_image = 0;
    }

    let params = {
      // pl_id
      COPIES: pCopies,
      P_IMAGEN: v_image,
      PEVENTO: '',
      PFACTURA: '',
    };

    if (pType == 8) {
      // -- PARA IMPRIMIR FACTURAS DE PORTAFOLIO
      if (this.billingSelected.factstatusId == 'PREF') {
        params.PEVENTO = this.billingSelected.eventId;
        params.PFACTURA = this.billingSelected.billId;
        reportName = 'RCOMERFACTURASPREF_INM';
      } else {
        params.PEVENTO = this.billingSelected.eventId;
        params.PFACTURA = this.billingSelected.billId;
        reportName = 'RCOMERFACTURAS_INM';
      }
    } else if (pType == 9) {
      // -- PARA IMPRIMIR FACTURAS DE INDIVIDUAL
      if (this.billingSelected.factstatusId == 'PREF') {
        params.PEVENTO = this.billingSelected.eventId;
        params.PFACTURA = this.billingSelected.billId;
        reportName = 'RCOMERFACTURASPREF_INM';
      } else {
        params.PEVENTO = this.billingSelected.eventId;
        params.PFACTURA = this.billingSelected.billId;
        reportName = 'RCOMERFACTURAS_INM';
      }
    } else if (pType == 10) {
      // -- PARA IMPRIMIR FACTURAS DE INDIVIDUAL PAGOS
      params.PEVENTO = this.billingSelected.eventId;
      params.PFACTURA = this.billingSelected.billId;
      reportName = 'RCOMERFACTURAS_INM';
    } else if (pType == 11) {
      // -- PARA IMPRIMIR FACTURAS DE PORTAFOLIO PAGOS
      params.PEVENTO = this.billingSelected.eventId;
      params.PFACTURA = this.billingSelected.billId;
      reportName = 'RCOMERFACTURAS_INM';
    }

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

  cancelBilling() {
    if (!this.causeBlkCtrl) {
      this.visualCancelYesNot(1); // --muestras los campos de la causa
      //   GO_ITEM('BLK_CTRL.CAUSA');
    } else {
      this.openModalDatCanc();
      //   : BLK_DAT_CANC.ID_EVENTO := NULL;
      //     : BLK_DAT_CANC.TXT_CVE_PROCESO := NULL;
      //     : BLK_DAT_CANC.ID_LOTE := NULL;
      //     : BLK_DAT_CANC.TXT_DESC_LOTE := NULL;
      //     : BLK_DAT_CANC.NO_DELEGACION := NULL;
      //     : BLK_DAT_CANC.TXT_DELEGACION := NULL;
      //     : BLK_DAT_CANC.CVMAN := NULL;
      //     : BLK_DAT_CANC.TXT_CVMAN := NULL;
      //   GO_ITEM('BLK_DAT_CANC.ID_EVENTO');
    }
  }

  openModalDatCanc(data?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      dataSeleccionada: this.selectedbillings,
      data,
      callback: (next: boolean) => {
        if (!next) {
          this.visualCancelYesNot(0);
        } else {
          // this.valDefaultWhere = true;
          this.getBillings();
        }

        console.log('AQUI', next);
      },
    };
    this.modalService.show(DatCancComponent, modalConfig);
  }

  attentionCustomer() {
    // ATENCION - Atención a Clientes
    this.alertQuestion(
      'question',
      `Se enviará el nuevo CFDI para Atención a Clientes`,
      '¿Desea continuar con el proceso?'
    ).then(async question => {
      if (question.isConfirmed) {
        await this.pupGenerateRoute3(); // PUP_GENERA_RUTA3
        await this.printerPackage(); // IMPRIME_PAQUETE

        this.alert('success', 'El CFDI nuevo fue enviado', '');
      }
    });
  }

  async pupGenerateRoute3() {
    // PUP_GENERA_RUTA3
    let V_PATH_TIPO: string = '';
    let L_PATH: string = '';
    if (!this.billingSelected)
      return this.alert('warning', 'Debe seleccionar una factura', '');
    const params = new ListParams();
    params['filter.id'] = `$eq:PATHANEXOS`;
    const parameter: any = await this.billingsService.getParamaters(params);
    if (!parameter)
      return this.alert('warning', 'No se obtuvo el parámetro del PATH', '');
    L_PATH = parameter.initialValue;
    if (
      this.billingSelected.vouchertype == 'FAC' &&
      this.billingSelected.series.startsWith('INGRG')
    ) {
      V_PATH_TIPO = 'INGRG\\';
    } else if (
      this.billingSelected.vouchertype == 'FAC' &&
      this.billingSelected.series.startsWith('EGRG')
    ) {
      V_PATH_TIPO = 'EGRG\\';
    }

    let V_ARCHOSAL = L_PATH + V_PATH_TIPO;
    //   V_RUTA2:= 'MD ' || V_ARCHOSAL || 'PDF\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'YYYY')||'\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'MM')||'\';
    //   LFIARCHIVO:= TEXT_IO.FOPEN('C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\CREARUTA3.BAT', 'W');
    //   TEXT_IO.PUT_LINE(LFIARCHIVO, V_RUTA2);
    //   TEXT_IO.FCLOSE(LFIARCHIVO);
    //   HOST('C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\CREARUTA3.BAT',NO_SCREEN);
    //   PUP_LIMPIA_ARCHIVO;
    //   V_ARCHOSAL:= L_PATH || V_PATH_TIPO;
    //   V_RUTA3:= 'MD ' || V_ARCHOSAL || 'XML\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'YYYY')||'\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'MM')||'\';
    //   LFIARCHIVO:= TEXT_IO.FOPEN('C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\CREARUTA3.BAT', 'W');
    //   TEXT_IO.PUT_LINE(LFIARCHIVO, V_RUTA3);
    //   TEXT_IO.FCLOSE(LFIARCHIVO);
    //   HOST('C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\CREARUTA3.BAT',NO_SCREEN);
  }
  async pupCleanArchive() {
    // PUP_LIMPIA_ARCHIVO
    // LFIARCHIVO:= TEXT_IO.FOPEN('C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\COPIACFISERV.BAT', 'W');
    // TEXT_IO.FCLOSE(LFIARCHIVO);
  }
  async printerPackage() {
    // IMPRIME_PAQUETE
    if (!this.billingSelected)
      return this.alert('warning', 'Debe seleccionar una factura', '');
    const params = new ListParams();
    params['filter.id'] = `$eq:PATHANEXOS`;
    const parameter: any = await this.billingsService.getParamaters(params);
    if (!parameter)
      return this.alert('warning', 'No se obtuvo el parámetro del PATH', '');

    let result = this.selectedbillings.map(async item => {
      await this.pupRepBillingMore(11, item.Type);
    });
  }

  async pupRepBillingMore(pType: number, item: any) {
    // PUP_REP_FACTURA_MAS
    let PTIPO = item.Type;
    if (pType == 10) {
      PTIPO = pType;
    } else if (pType == 11) {
      PTIPO = pType;
    }
    const impressionDate = new Date(item.impressionDate);
    var mes: any = impressionDate.getMonth(); // Obtener el mes (0-11)
    var anio = impressionDate.getFullYear(); // Obtener el año (yyyy)
    if (mes < 9) {
      mes = '0' + (mes + 1);
    } else {
      mes = mes + 1;
    }

    let V_PATH_TIPO = `ANEXOS\\${anio}\\${mes}\\`;
    let V_PATH_TIPO1 = `XML\\${anio}\\${mes}\\`;

    if (item.vouchertype == 'FAC' && item.series.startsWith('INGRG')) {
      V_PATH_TIPO = 'INGRG\\' + V_PATH_TIPO;
      V_PATH_TIPO1 = 'INGRG\\' + V_PATH_TIPO1;
    } else if (item.vouchertype == 'FAC' && item.series.startsWith('EGRG')) {
      V_PATH_TIPO1 = 'EGRG\\' + V_PATH_TIPO1;
    } else if (item.vouchertype == 'NCR' && item.series.startsWith('EGRG')) {
      V_PATH_TIPO = 'EGRG\\' + V_PATH_TIPO;
    }
    // PROGRAMACIÓN DETENIDA PARA CHECAR FUNCIONALIDAD //
  }

  async prefPaysParc() {
    // Pref Pagos Parciales - GEN_XPAGOS
    const eventId = this.idEventBlkCtrl.value;
    if (!eventId)
      return (
        this.form.get('idEvent').markAsTouched(),
        this.alert('warning', 'Debe ingresar el No. Evento', '')
      );
    // --VALIDA QUE EXISTAN LOTES VALIDOS PARA FACTURAR-- //
    const lotPublic = !this.form.get('idLotPublic').value
      ? null
      : this.form.get('idLotPublic').value;

    const obj: any = {
      idEvent: eventId,
      idLotPub: lotPublic,
      formKey: 'FCOMER086_I',
    };
    let counter: any = await this.billingsService.getApplicationLotCounter(obj); // CAMBIAR POR EL ENDPOINT NUEVO //
    if (counter == 0)
      return this.alert(
        'warning',
        'No se encontraron lotes con estatus válidos para facturar, verifique',
        ''
      );

    // --VALIDA QUE HAYA LOTES PARA FACTURAR--
    // --SE ADICIONA LA VALIDACIÓN DE MANDATOS QUE NO SE FACTURAN--

    const obj2: any = {
      idEvent: eventId,
      idLotPub: lotPublic,
    };
    counter = await this.billingsService.getApplicationBugInfoCounter(obj2); // CAMBIAR POR EL ENDPOINT NUEVO //
    if (counter == 0)
      return this.alert(
        'warning',
        'No se encontraron Lotes/Pagos para facturar, verifique.',
        ''
      );

    const obj3: any = {
      idEvent: eventId,
      idLotPub: lotPublic,
    };
    const count_noFact: any =
      await this.billingsService.getApplicationNofactCounter(obj3); // CAMBIAR POR EL ENDPOINT NUEVO //
    if (count_noFact > 0)
      return this.alert(
        'warning',
        `No se generan ${count_noFact} facturas por Mandatos no facturables`,
        ''
      );

    const obj4: any = {
      idEvent: eventId,
      idLotPub: lotPublic,
    };

    const counter1: any = await this.billingsService.getApplicationCounter1(
      obj4
    ); // CAMBIAR POR EL ENDPOINT NUEVO //
    if (counter <= counter1)
      return this.alert('warning', `No se tienen pagos a facturar.`, '');
    this.alertQuestion(
      'question',
      `Se generarán ${Number(counter) - Number(counter1)} facturas`,
      '¿Desea ejecutar el proceso?'
    ).then(async question => {
      if (question.isConfirmed) {
        let obj: any = {
          p_id_evento: eventId,
          p_opcion: 0,
          p_lote_publico: lotPublic,
          p_cve_pantalla: 'FCOMER086_I',
          p_id_factura: null,
          p_id_pago: null,
          p_documento: 'FAC',
          p_secdoc: 'S',
          p_ind_gendet: 1,
          p_no_delegacion: null,
          p_mandato: null,
          p_parcialidad: null,
        };
        // PA_NVO_FACTURA_PAG
        const newBillingPay: any = await this.billingsService.paNewBillingPay(
          obj
        ); // EDWIN - CORRECCIÓN
        if (!newBillingPay)
          return this.alert(
            'error',
            `Ha ocurrido un error`,
            'Verifique e intente nuevamente'
          );
        const c_result = newBillingPay;
        if (c_result == 'Correcto.') {
          this.valDefaultWhere = true;
          await this.getBillings(); // GO_BLOCK('COMER_FACTURAS');
          await this.visualProcess(0, 2); // VISUALIZA_PROCESO(0, 1);

          const params = new FilterParams();
          params.addFilter('idEvent', eventId, SearchFilter.EQ); // COMER_INCONSISTENCIAS
          const countInconsistencias: any =
            await this.billingsService.getEatInconsistences(obj);
          if (countInconsistencias.count > 0) {
            this.cambiarTab(1);
            this.valDefaultWhereInconsistencias = true;
            this.getInconsistencies_();
          }
          this.alert('success', 'Proceso terminado correctamente', '');
        }
      }
    });
  }

  update2() {
    // Act Datos Pagos - ACTUALIZA2
    this.pupActData('P'); // PUP_ACT_DATOS ('P')
  }

  async selectAll() {
    //  Selec. Todos - SELEC_TODO
    // USUVALIDO:= PK_COMER_FACTINM.F_VALIDA_USUARIO(: BLK_TOOLBAR.TOOLBAR_USUARIO,
    //
    let obj = {
      pUser: this.token.decodeToken().username,
      pAddress: 'I',
    };
    const fValidateUser: any = await this.billingsService.getFValidateUser(obj);
    if (fValidateUser != 1) {
      this.alert(
        'warning',
        'No cuenta con los permisos para efectuar esta operación',
        ''
      );
    } else {
      if (!this.dateBlkCtrl.value) {
        if (!(await this.valBillingsSelects()))
          return (
            this.form.get('idEvent').markAsTouched(),
            this.alert('warning', 'No se tienen facturas a procesar.', '')
          );
        // ASIG_FEC_IMP;
        this.asigDateImp();
      } else {
        // PUP_NVO_SELEC_TODOS;
        this.pupNewSelecAll();
      }
    }
  }

  async asigDateImp() {
    const obj: any = {
      parameter: 'SUPUSUFACTR',
      value: this.token.decodeToken().username,
      address: 'I',
    };
    const c_Reg: any = await this.billingsService.pufUsuReg(obj); // PUF_USU_REG;
    let cont = 0;
    const result = this.data.getElements().then(async item => {
      let result_ = item.map(async (item_: any) => {
        if (
          !item_.impressionDate &&
          !['CFDI', 'IMP', 'CAN'].includes(item_.factstatusId)
        ) {
          let obj = {
            billId: item_.billId,
            eventId: item_.eventId,
            impressionDate: this.datePipe.transform(
              this.dateBlkCtrl.value,
              'yyyy-MM-dd'
            ),
          };
          if (c_Reg == 'S') {
            if (item_.delegationNumber == this.token.decodeToken().department) {
              const updateDateImp = this.billingsService.updateBillings(obj);
              // : COMER_FACTURAS.FECHA_IMPRESION := : BLK_CTRL.fecha;
              cont = cont + 1;
            }
          } else {
            const updateDateImp = this.billingsService.updateBillings(obj);
            // : COMER_FACTURAS.FECHA_IMPRESION := : BLK_CTRL.fecha;
            cont = cont + 1;
          }
        }
      });

      Promise.all(result_).then(resp => {
        this.alert('success', `Se actualizó la fecha a ${cont} facturas.`, '');
        // LIP_MENSAJE('Se actualizó la fecha a ' || TO_CHAR(n_CONT) || ' facturas.', 'A');
      });
    });
  }

  async pupNewSelecAll() {
    const obj: any = {
      parameter: 'SUPUSUFACTR',
      value: this.token.decodeToken().username,
      address: 'I',
    };
    const c_Reg: any = await this.billingsService.pufUsuReg(obj); // PUF_USU_REG;
    // const c_Reg = 'S';

    if (!(await this.valBillingsSelects()))
      return this.alert('warning', 'No se tienen facturas a procesar.', '');

    let cont = 0;
    const result = this.data.getElements().then(async item => {
      let result_ = item.map(async (item_: any) => {
        if (
          !item_.impressionDate &&
          !['CFDI', 'IMP', 'CAN'].includes(item_.factstatusId)
        ) {
          if (c_Reg == 'S') {
            if (item_.delegationNumber == this.token.decodeToken().department) {
              this.selectedbillings.push(item);
              cont = cont + 1;
            }
          } else {
            this.selectedbillings.push(item);
            cont = cont + 1;
          }
        }
      });

      Promise.all(result_).then(resp => {
        this.data.refresh();
        this.alert('success', `Se seleccionaron ${cont} facturas.`, '');
      });
    });
  }

  async deleteEventLote() {
    let n_COFT: any;
    let n_COFP: any;
    let n_COPT: any;
    let n_COPP: any;
    let l_BAN: boolean = false;
    let c_MENS: string = '';
    let n_IND: number;
    const eventId = this.idEventBlkCtrl.value;
    if (!eventId)
      return (
        this.form.get('idEvent').markAsTouched(),
        this.alert('warning', 'Debe ingresar el No. Evento', '')
      );

    const params = new ListParams();

    params['filter.eventId'] = `$eq:${this.idEventBlkCtrl.value}`;
    params['filter.vouchertype'] = `$eq:FAC`;
    params['filter.factstatusId'] = `$not:$in:CAN`;

    const countFacturas: any = await this.billingsService.getBillings(params);
    if (countFacturas.count == 0)
      return this.alert(
        'warning',
        'No se tienen facturas para este Evento/Lote',
        ''
      );

    //   SELECT COUNT(0), SUM(DECODE(ID_ESTATUSFACT, 'PREF', 1, 0))
    //  INTO n_COFT, n_COFP
    //  FROM COMER_FACTURAS
    // WHERE ID_EVENTO = : BLK_CTRL.ID_EVENTO
    //   AND ID_LOTE = NVL(: BLK_CTRL.ID_LOTE_PUB, ID_LOTE)
    //   AND TIPOCOMPROBANTE = 'FAC'
    //   AND ID_ESTATUSFACT <> 'CAN'
    //   AND TIPO IN(8, 9);
    // --Se obtiene el total de facturas de pago y las que estén en PREF--

    //  SELECT COUNT(0), SUM(DECODE(ID_ESTATUSFACT, 'PREF', 1, 0))
    //     INTO n_COPT, n_COPP
    //    FROM COMER_FACTURAS
    //   WHERE ID_EVENTO = : BLK_CTRL.ID_EVENTO
    //     AND ID_LOTE = NVL(: BLK_CTRL.ID_LOTE_PUB, ID_LOTE)
    //     AND TIPOCOMPROBANTE = 'FAC'
    //     AND ID_ESTATUSFACT <> 'CAN'
    //     AND TIPO IN(10, 11);

    if (n_COPT == 0) {
      // --Si no hay facturas de pago y todas las de fallo están en PREF se habilita el borrado--
      if (n_COFT == n_COFP) {
        l_BAN = true;
      } else {
        c_MENS = `De ${n_COPT} factura(s) de pago, solo se tienen ${n_COPP} en estatus PREF`;
      }
    } else {
      c_MENS = `Todavía se tiene ${n_COFP} factura(s) en estatus PREF de ${n_COFT} factura(s) de fallo`;
    }
    if (l_BAN) {
      if (this.idLotPublicBlkCtrl.value) {
        n_IND = 2;
      } else {
        n_IND = 1;
      }

      this.alertQuestion(
        'question',
        `Se eliminarán ${Number(n_COFP) + Number(n_COPP)} factura(s)`,
        ''
      ).then(async question => {
        if (question.isConfirmed) {
          // PK_COMER_FACTINM.PA_ELIMINA_FAC
          const paDeleteFac: any = await this.billingsService.getBillings(
            params
          );
          if (!paDeleteFac)
            return this.alert(
              'error',
              'Ocurrió un error al intentar eliminar las facturas',
              ''
            );
          if (paDeleteFac == 'Correcto.') {
            this.valDefaultWhere = true;
            this.getBillings();
            this.alert('success', 'Proceso Terminado Correctamente', '');
          }
        }
      });
    } else {
      this.alert('warning', c_MENS, '');
    }
  }

  export() {
    if (this.selectedbillings.length == 0)
      return this.alert(
        'warning',
        'No hay facturas seleccionadas para exportar',
        ''
      );
    let arr: any = [];
    let result = this.selectedbillings.map(async item => {
      let obj2 = {
        EVENTO: item.eventId,
        ID_LOTE: item.batchId,
        ESTATUS: item.factstatusId,
        COMPROBANTE: item.vouchertype,
        SER_FOL: item.series,
        TIPO: await this.typeBilling(item.Type),
        DELEGACION: item.desDelegation,
        MANDATO: item.cvman,
        NO_BIEN: item.goodNumber,
        DESCRIPCION: item.description,
        DESC_CVMAN: item.downloadcvman,
        UNIDAD: item.unit,
        PRODUCTO_SERVICIO_SAT: item.prodservSatKey,
        UNIDAD_SAT: item.unitSatKey,
        MONTO_GRAVADO: item.amountappsvat,
        MONTO_EXENTO: item.amountnoappvat,
        IMPORTE: item.price,
        IVA: item.vat,
        TOTAL: item.total,
        TASA_CUOTA_SAT: item.rateShareSatKey,
        IMPUESTO_SAT: item.taxSatKey,
        TIPO_FACTOR_SAT: item.factorSatType,
      };
      arr.push(obj2);
    });

    Promise.all(result).then(resp => {
      const filename: string = 'FCOMER086_I_CSV';
      this.excelService.export(arr, { type: 'csv', filename });
    });
  }

  async typeBilling(type: any) {
    if (type == 8) {
      return 'PORTAFOLIO';
    } else if (type == 9) {
      return 'INDIVIDUAL';
    } else if (type == 10) {
      return 'INDIVIDUAL PAGOS';
    } else if (type == 11) {
      return 'PORTAFOLIO PAGOS';
    }
    return type;
  }

  generateInvoices() {
    // Genera Folios - FOLIOS
    // EN ESPERA DEL ENDPOINT DE EDWIN
  }
  valDate: boolean = false;
  getDate() {}

  optSortBy: number;
  valSortBy: boolean = false;
  changeOpt(event: any) {
    if (event == 1) this.params.getValue()['sortBy'] = `batchId:DESC`;
    if (event == 2) this.params.getValue()['sortBy'] = `delegationNumber:DESC`;
    if (event == 4) this.params.getValue()['sortBy'] = `Invoice:DESC`;
    // this.optSortBy = event;
    this.valSortBy = true;
    if (!event) this.valSortBy = false;
    this.getBillings();
    // this.valDefaultWhere
  }

  edit(event: any) {
    const factura = event.data;

    if (factura.factstatusId === 'PREF') {
      this.openModalEdit(factura);
    } else {
      this.alert(
        'warning',
        'La factura tiene un estatus inválido, no se puede editar',
        ''
      );
    }
    //         IF: COMER_FACTURAS.ID_ESTATUSFACT = 'PREF' THEN
    //         SET_ITEM_INSTANCE_PROPERTY('COMER_FACTURAS.CVE_TIPO_RELACION_SAT', CURRENT_RECORD, UPDATE_ALLOWED, PROPERTY_TRUE);
    //         SET_ITEM_INSTANCE_PROPERTY('COMER_FACTURAS.USO_COMP_SAT', CURRENT_RECORD, UPDATE_ALLOWED, PROPERTY_TRUE);
    //         SET_ITEM_INSTANCE_PROPERTY('COMER_FACTURAS.FORMAPAGO_BSAT', CURRENT_RECORD, UPDATE_ALLOWED, PROPERTY_TRUE);
  }

  openModalEdit(data?: any) {
    const modalConfig = {
      initialState: {},
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    modalConfig.initialState = {
      data,
      callback: (next: boolean) => {
        if (!next) {
          this.getBillings();
        }
      },
    };
    this.modalService.show(UpdateFacturaComponent, modalConfig);
  }
}

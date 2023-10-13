import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { COMER_EST_LOTES, INCONSISTENCIAS, INCONSISTENCIAS1 } from './columns';

@Component({
  selector: 'app-billing-screen',
  templateUrl: './billing-screen.component.html',
  styles: [``],
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

  disabledCause: boolean = true;
  disabledDescause: boolean = true;
  disabledRegCanc: boolean = true;

  disabledGenXPays: boolean = true;
  disabledUpdate2: boolean = true;
  disabledGenPreFac100: boolean = true;
  disabledUpdate: boolean = true;

  constructor(
    private fb: FormBuilder,
    private msInvoiceService: MsInvoiceService,
    private lotService: LotService
  ) {
    super();

    this.settings = {
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
        folioinvoiceId: {
          title: 'Folio',
          type: 'string',
          sort: false,
          width: '10%',
        },
        factstatusId: {
          title: 'Estatus',
          type: 'string',
          sort: false,
          width: '10%',
        },
        customer: {
          title: 'Cliente',
          type: 'string',
          sort: false,
          width: '30%',
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
        impressionDate: {
          title: 'Fecha',
          type: 'string',
          sort: false,
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
      (billing: any) => billing.billId == _billing.billId
    );
    return !exists ? false : true;
  }
  billingSelectedChange(billing: any, selected: boolean) {
    if (selected) {
      this.selectedbillings.push(billing);
    } else {
      this.selectedbillings = this.selectedbillings.filter(
        (_billing: any) => _billing.billId != billing.billId
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
    const exists = this.selectedbillings.find(
      (billing: any) => billing.billId == _billing.billId
    );
    return !exists ? false : true;
  }
  billingDetSelectedChange(billing: any, selected: boolean) {
    if (selected) {
      this.selectedbillings.push(billing);
    } else {
      this.selectedbillings = this.selectedbillings.filter(
        (_billing: any) => _billing.billId != billing.billId
      );
    }
  }

  ngOnInit(): void {
    this.prepareForm();

    // ------------- PREPARAMOS FILTRADOS DE LAS TABLAS ------------- //
    this.filterTable1(); // Facturas - COMER_FACTURAS
    this.filterTable2(); // Detalle de la Factura - COMER_DETFACTURAS
    this.filterTable3(); // Errores y Datos Nulos - COMER_INCONSISTENCIAS
    this.filterTable4(); // Errores al obtener folios de SIRSAE - COMER_INCONSISTENCIAS1
    this.filterTable5(); // Actualización de Eventos - COMER_EST_LOTES
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
              folioinvoiceId: () => (searchFilter = SearchFilter.ILIKE),
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

    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDetailsFacturas());
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
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInconsistencies_());
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
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInconsistencies_1());
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
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getEatEstLot());
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

  getBillings() {
    // Facturas - COMER_FACTURAS
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.address'] = `$eq:I`;
    params['sortBy'] = `eventId:DESC`;
    this.msInvoiceService.getAllBillings(params).subscribe({
      next: response => {
        console.log(response);

        // let result = response.data.map(async (item: any) => {
        //   // item['rfc'] = item.customers ? item.customers.rfc : null;
        // });
        // Promise.all(result).then(resp => {
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
        // });
      },
      error: error => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  getDetailsFacturas() {
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

  getInconsistencies_() {
    // Errores y Datos Nulos - COMER_INCONSISTENCIAS
    this.loading3 = true;
    this.totalItems3 = 0;
    let params = {
      ...this.params3.getValue(),
      ...this.columnFilters3,
    };
    params['filter.downloadMistake'] = `$not:$ilike:ERROR_FOLIO`;
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

  getInconsistencies_1() {
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

  getEatEstLot() {
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

  rowsSelected(event: any) {}

  GEN_PREFAC_100() {
    // Prefacturar Fallo
    //
  }

  ACTUALIZA() {
    // Act Datos Fallo
    // PUP_ACT_DATOS ('F')
  }

  PUP_ACT_DATOS() {
    // GO_BLOCK('COMER_FACTURAS');
    // PK_COMER_FACTINM.F_VALIDA_USUARIO
    // c_REG:= PUF_USU_REG;
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
    //REGCANC
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

  ATENCION() {
    // Atención a Clientes
    // IF PUF_MENSAJE_SI_NO('Se enviara el nuevo CFDI para Atención a Clientes, ¿desea continuar?: ') = 'S' THEN
    //   SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
    //   PUP_GENERA_RUTA3;
    //   IMPRIME_PAQUETE;
    //   SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'NORMAL');
    //   LIP_MENSAJE('el CFDI nuevo fue enviado...', 'C');
    // END IF;
    //   EXCEPTION
    // WHEN OTHERS THEN
    //   SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'NORMAL');
    //   LIP_MENSAJE('Al enviar el nuevo CFDI > ' || sqlerrm, 'S');
  }

  CFDI() {
    // Genera CFDI
    // DECLARE
    // SEL NUMBER(1) := 0;
    //   BEGIN
    //   SEL:= HAY_SELECCION;
    // IF SEL = 1  THEN-- VA AL LINK DE PARA GENERAR LOS XML Y SELLO
    //   Host(FA_URLWEB_FAC(: COMER_FACTURAS.ID_EVENTO), NO_SCREEN);
    //   ELSE
    //   FIRST_RECORD;
    //   SYNCHRONIZE;
    //   LIP_MENSAJE('No se tienen registros seleccionados.', 'S');
    // END IF;
    //   END;
  }

  FALLO() {
    // Actualiza a VEN
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
      return this.alert(
        'warning',
        'No hay facturas seleccionadas para procesar',
        ''
      );
  }

  /** Validación de facturas seleccionadas para procesar **/
  async valBillingsSelects() {
    //   FIRST_RECORD;
    //   IF: COMER_FACTURAS.ID_EVENTO IS NULL THEN
    //   SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
    //   LIP_MENSAJE('No se tienen Facturas a procesar.', 'S');
    //     RAISE FORM_TRIGGER_FAILURE;
    //  END IF;
    if (this.selectedbillings.length == 0) {
      return false;
    } else {
      return true;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, catchError, of, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { InterfacesirsaeService as InterfaceSirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from './../../../../shared/components/select/default-select';
import { CONSULT_SIRSAE_COLUMNS } from './sirsae-payment-consultation-columns';

@Component({
  selector: 'app-sirsae-payment-consultation-list',
  templateUrl: './sirsae-payment-consultation-list.component.html',
  styles: [],
})
export class SirsaePaymentConsultationListComponent
  extends BasePage
  implements OnInit
{
  // Usando tipo any hasta tener disponibles los servicios de la api
  params = new BehaviorSubject<ListParams>(new ListParams());
  // goodSelected: boolean = false;
  form: FormGroup = new FormGroup({
    reference: new FormControl(null, [Validators.required]),
    // id: new FormControl(null, [Validators.required]),
    startDate: new FormControl(null, [Validators.required]),
    endDate: new FormControl(null, [Validators.required]),
    bank: new FormControl(null),
    status: new FormControl(null),
  });
  // filterForm: FormGroup = new FormGroup({
  // });

  columns: any[] = [];
  totalItems: number = 0;
  goodItems = new DefaultSelect();
  maxDate: Date = new Date();
  toggleFilter: boolean = false;
  consultSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  tableSource: LocalDataSource;
  tableFilters: any[] = [];

  // paymentsTestData: any = [
  //   {
  //     id: 1,
  //     code: 'ASEG',
  //     description: 'NUMERARIO FÍSICO POR LA CANTIDAD DE US$200.00',
  //     appraisal: 200,
  //     status: 'Bien entregado en Administración',
  //     domain: 'ASEGURADO',
  //     converted: false,
  //   },
  //   {
  //     id: 2,
  //     code: 'BIEN',
  //     description: 'BIEN DE EJEMPLO POR LA CANTIDAD DE US$500.00',
  //     appraisal: 500,
  //     status: 'Bien entregado en Administración',
  //     domain: 'ASEGURADO',
  //     converted: false,
  //   },
  //   {
  //     id: 3,
  //     code: 'GOOD',
  //     description: 'BIEN PARA PRUEBAS POR LA CANTIDAD DE US$100.00',
  //     appraisal: 100,
  //     status: 'Bien entregado en Administración',
  //     domain: 'ASEGURADO',
  //     converted: false,
  //   },
  //   {
  //     id: 4,
  //     code: 'ASEG',
  //     description: 'NUMERARIO FÍSICO POR LA CANTIDAD DE US$700.00',
  //     appraisal: 700,
  //     status: 'Bien entregado en Administración',
  //     domain: 'ASEGURADO',
  //     converted: false,
  //   },
  //   {
  //     id: 5,
  //     code: 'BIEN',
  //     description: 'BIEN PARA PROBAR INTERFAZ POR LA CANTIDAD DE US$50.00',
  //     appraisal: 50,
  //     status: 'Bien entregado en Administración',
  //     domain: 'ASEGURADO',
  //     converted: false,
  //   },
  // ];

  paymentTestData: any = [
    {
      account: 1234567,
      bank: 'BANAMEX',
      reference: '069012189COM PDTE C COMPRA',
      moveDate: 130411,
      amount: 10000,
      cve: 2226,
      status: 0,
      description: 'PAGADO',
    },
    {
      account: 1254786,
      bank: 'BANAMEX',
      reference: '069012189COM PDTE C COMPRA',
      moveDate: 100811,
      amount: 5000,
      cve: 2226,
      status: 0,
      description: 'PAGADO',
    },
    {
      account: 2457841,
      bank: 'BANCO SANTANDER',
      reference: '069012189COM PDTE C COMPRA',
      moveDate: 120912,
      amount: 7000,
      cve: 2226,
      status: 0,
      description: 'PAGADO',
    },
    {
      account: 2514638,
      bank: 'BANCO SANTANDER',
      reference: '069012189COM PDTE C COMPRA',
      moveDate: 181112,
      amount: 11000,
      cve: 2226,
      status: 1,
      description: 'CHEQUE SALVO BUEN COBRO',
    },
    {
      account: 3452986,
      bank: 'BANORTE',
      reference: '069012189COM PDTE C COMPRA',
      moveDate: 280113,
      amount: 4000,
      cve: 2226,
      status: 2,
      description: 'CHEQUE DEVUELTO',
    },
  ];

  statusesMov: { id: number; statusDescription: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private interfaceSirsaeService: InterfaceSirsaeService // private goodService: GoodService, // private bankAccountService: BankAccountService
  ) {
    super();
    this.tableSource = new LocalDataSource(this.columns);
  }

  ngOnInit(): void {
    this.getStatusesMov();
    this.consultSettings.columns = CONSULT_SIRSAE_COLUMNS;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSearch());
  }

  getStatusesMov(): void {
    this.interfaceSirsaeService
      .getStatusesMov({ limit: 100, page: 1 })
      .subscribe(res => {
        console.log(res);
        this.statusesMov = res.data;
      });
  }

  getSearch() {
    this.loading = true;
    console.log(this.params.getValue());
    this.loading = false;
  }

  filterStatus(query: string) {
    this.addFilter(query, 'status');
  }

  addFilter(query: string, column: string) {
    if (this.tableFilters.length > 0) {
      let hasFilter: boolean = false;
      let filterIndex: number;
      this.tableFilters.forEach((f, i) => {
        if (f.field === column) {
          hasFilter = true;
          filterIndex = i;
        }
      });
      if (hasFilter) {
        this.tableFilters[filterIndex] = {
          field: column,
          search: query,
        };
      } else {
        this.tableFilters.push({ field: column, search: query });
      }
      this.filterTable();
    } else {
      this.tableFilters.push({ field: column, search: query });
    }
    this.filterTable();
  }

  filterTable() {
    this.tableSource.setFilter(this.tableFilters, true);
    this.totalItems = this.tableSource.count();
  }

  resetFilter() {
    this.tableSource.empty().then(res => {
      this.tableSource.refresh();
    });
    this.form.reset();
  }

  consult() {
    console.log(this.form.value);
    if (this.tableSource.count() > 0) {
      this.tableSource.empty().then(res => {
        this.tableSource.refresh();
      });
    }
    this.loading = true;
    this.interfaceSirsaeService
      .getAccountDetail(this.generateParams().getParams())
      .pipe(
        catchError(() => {
          this.loading = false;
          return of(null);
        })
      )
      .subscribe({
        next: res => {
          if (!res) {
            this.tableSource.reset();
            this.tableSource.refresh();
            return;
          }
          console.log(res);
          this.columns = res.data;
          this.totalItems = this.columns.length;
          this.tableSource = new LocalDataSource(this.columns);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  generateParams(): FilterParams {
    const filters = new FilterParams();
    const { reference, startDate, endDate, bank, status } = this.form.value;

    filters.addFilter('reference', reference, SearchFilter.LIKE);
    filters.addFilter('startDate', startDate, SearchFilter.GTE);
    filters.addFilter('endDate', endDate, SearchFilter.LTE);

    if (bank) {
      filters.addFilter('bank', bank);
    }
    if (status) {
      filters.addFilter('status', status);
    }
    return filters;
  }

  getData() {
    return this.paymentTestData;
  }
}

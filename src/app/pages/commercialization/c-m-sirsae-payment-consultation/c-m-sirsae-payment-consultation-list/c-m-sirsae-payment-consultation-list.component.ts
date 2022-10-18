import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DefaultSelect } from './../../../../shared/components/select/default-select';
import { CONSULT_SIRSAE_COLUMNS } from './c-m-sirsae-payment-consultation-columns';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-c-m-sirsae-payment-consultation-list',
  templateUrl: './c-m-sirsae-payment-consultation-list.component.html',
  styles: [],
})
export class CMSirsaePaymentConsultationListComponent
  extends BasePage
  implements OnInit
{
  // Usando tipo any hasta tener disponibles los servicios de la api
  params = new BehaviorSubject<ListParams>(new ListParams());
  goodSelected: boolean = false;
  consultForm: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});
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

  goodTestData: any = [
    {
      id: 1,
      code: 'ASEG',
      description: 'NUMERARIO FÍSICO POR LA CANTIDAD DE US$200.00',
      appraisal: 200,
      status: 'Bien entregado en Administración',
      domain: 'ASEGURADO',
      converted: false,
    },
    {
      id: 2,
      code: 'BIEN',
      description: 'BIEN DE EJEMPLO POR LA CANTIDAD DE US$500.00',
      appraisal: 500,
      status: 'Bien entregado en Administración',
      domain: 'ASEGURADO',
      converted: false,
    },
    {
      id: 3,
      code: 'GOOD',
      description: 'BIEN PARA PRUEBAS POR LA CANTIDAD DE US$100.00',
      appraisal: 100,
      status: 'Bien entregado en Administración',
      domain: 'ASEGURADO',
      converted: false,
    },
    {
      id: 4,
      code: 'ASEG',
      description: 'NUMERARIO FÍSICO POR LA CANTIDAD DE US$700.00',
      appraisal: 700,
      status: 'Bien entregado en Administración',
      domain: 'ASEGURADO',
      converted: false,
    },
    {
      id: 5,
      code: 'BIEN',
      description: 'BIEN PARA PROBAR INTERFAZ POR LA CANTIDAD DE US$50.00',
      appraisal: 50,
      status: 'Bien entregado en Administración',
      domain: 'ASEGURADO',
      converted: false,
    },
  ];

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

  constructor(private fb: FormBuilder) {
    super();
    this.tableSource = new LocalDataSource(this.columns);
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGoods({ inicio: 1, text: '' });
    this.consultSettings.columns = CONSULT_SIRSAE_COLUMNS;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSearch());
  }

  getSearch() {
    this.loading = true;
    console.log(this.params.getValue());
    this.loading = false;
  }

  private prepareForm(): void {
    this.consultForm = this.fb.group({
      id: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    });
    this.filterForm = this.fb.group({
      bank: [null],
      status: [null],
    });
  }

  getGoods(params: ListParams) {
    if (params.text == '') {
      this.goodItems = new DefaultSelect(this.goodTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.goodTestData.filter((i: any) => i.id == id)];
      this.goodItems = new DefaultSelect(item[0], 1);
    }
  }

  filterBank(query: string) {
    this.filterTable(query, 'bank');
  }

  filterStatus(query: string) {
    this.filterTable(query, 'status');
  }

  filterTable(query: string, column: string) {
    this.tableSource.setFilter(
      [
        {
          field: column,
          search: query,
        },
      ],
      false
    );
    this.totalItems = this.tableSource.count();
  }

  resetFilter() {
    this.tableSource.reset();
    this.tableSource.refresh();
  }

  consult() {
    console.log(this.consultForm.value);
    this.loading = true;
    this.columns = this.getData();
    this.totalItems = this.columns.length;
    this.tableSource = new LocalDataSource(this.columns);
    this.goodSelected = true;
    this.loading = false;
  }

  getData() {
    return this.paymentTestData;
  }
}

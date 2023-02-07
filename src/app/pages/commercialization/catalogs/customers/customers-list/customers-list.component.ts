import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CustomersBlackListComponent } from '../customers-black-list/customers-black-list.component';
import { CustomersModalComponent } from '../customers-modal/customers-modal.component';
import { CustomersWhiteListComponent } from '../customers-white-list/customers-white-list.component';
import { RepresentativesModalComponent } from '../representatives-modal/representatives-modal.component';
//Columns
import { CUSTOMERS_COLUMNS } from './customers-columns';
import { REPRESENTATIVES_COLUMNS } from './representatives-columns';
//Models
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
import { IRepresentative } from 'src/app/core/models/catalogs/representative-model';
//Services
import { ExcelService } from 'src/app/common/services/excel.service';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styles: [],
})
export class CustomersListComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  customers: ICustomer[] = [];
  representative: IRepresentative[] = [];

  settings2;
  data: any;

  constructor(
    private modalService: BsModalService,
    private customerService: CustomerService,
    private excelService: ExcelService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...CUSTOMERS_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },

      columns: { ...REPRESENTATIVES_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCustomers());
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRepresentative());
  }

  //Table de todos los clientes
  getCustomers() {
    this.loading = true;
    this.customerService.getAllClients(this.params.getValue()).subscribe({
      next: response => {
        this.customers = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  //Exportar todos los clientes
  exportAllClients(): void {
    this.excelService.exportAsExcelFile(this.customers, 'Todos los clientes');
  }

  openFormClients(customers?: ICustomer) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      customers,
      callback: (next: boolean) => {
        if (next) this.getCustomers();
      },
    };
    this.modalService.show(CustomersModalComponent, modalConfig);
  }

  //Abrir modal de lista negra
  openBlackList() {
    const modalConfig = MODAL_CONFIG;

    this.modalService.show(CustomersBlackListComponent, modalConfig);
  }

  //Abrir modal de lista blanca
  openWhiteList() {
    const modalConfig = MODAL_CONFIG;
    this.modalService.show(CustomersWhiteListComponent, modalConfig);
  }

  //Tabla de representates
  getRepresentative() {
    this.loading = true;
    this.customerService
      .getAllRepresentative(this.params2.getValue())
      .subscribe({
        next: response => {
          this.representative = response.data;
          this.totalItems2 = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  //Exportar representates
  exportAllRepresentative(): void {
    this.excelService.exportAsExcelFile(
      this.representative,
      'Todos los representantes'
    );
  }

  openFormRepresentative() {
    const modalConfig = MODAL_CONFIG;

    this.modalService.show(RepresentativesModalComponent, modalConfig);
  }
}

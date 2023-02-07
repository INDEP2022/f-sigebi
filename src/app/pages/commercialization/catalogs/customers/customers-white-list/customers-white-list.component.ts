import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CUSTOMERS_LIST_COLUMNS } from '../customers-black-list/customers-list-columns';

@Component({
  selector: 'app-customers-white-list',
  templateUrl: './customers-white-list.component.html',
  styles: [],
})
export class CustomersWhiteListComponent extends BasePage implements OnInit {
  title: string = 'Clientes sin problemas';
  edit: boolean = false;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  customers: ICustomer[] = [];

  constructor(
    private modalRef: BsModalRef,
    private customerService: CustomerService,
    private excelService: ExcelService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...CUSTOMERS_LIST_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCustomers());
  }

  //Tabla de lista blanca de clientes
  getCustomers() {
    this.loading = true;
    this.customerService
      .getAllClientsWhiteList(this.params.getValue())
      .subscribe({
        next: response => {
          this.customers = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  //Exportar lista blanca de clientes
  exportClientsWhiteList(): void {
    this.excelService.exportAsExcelFile(
      this.customers,
      'Clientes sin problemas'
    );
  }

  close() {
    this.modalRef.hide();
  }
}

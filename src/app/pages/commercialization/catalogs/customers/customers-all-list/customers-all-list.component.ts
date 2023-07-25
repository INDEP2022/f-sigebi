import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IRepresentative } from 'src/app/core/models/catalogs/representative-model';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CUSTOMERS_LIST_COLUMNS } from '../customers-black-list/customers-list-columns';

@Component({
  selector: 'app-customers-all-list.component',
  templateUrl: './customers-all-list.component.html',
  styles: [],
})
export class CustomersAllListComponent extends BasePage implements OnInit {
  title: string = 'Todos los Clientes';
  customers: IRepresentative[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  edit: boolean = false;

  constructor(
    private customerService: CustomerService,
    private excelService: ExcelService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings.columns = CUSTOMERS_LIST_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'reasonName':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'paternalSurname':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'maternalSurname':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'rfc':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'phone':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'blackList':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getCustomers();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCustomers());
  }

  //Tabla con todos los clientes
  getCustomers() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.customerService.getAllClients(params).subscribe({
      next: response => {
        this.customers = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  //Exportar lista blanca de clientes
  exportClientsWhiteList(): void {
    this.excelService.exportAsExcelFile(this.customers, 'TodosLosClientes');
  }

  close() {
    this.modalRef.hide();
  }
}

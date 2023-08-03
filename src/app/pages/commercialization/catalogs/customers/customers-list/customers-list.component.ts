import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
import { IRepresentative } from 'src/app/core/models/catalogs/representative-model';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { MassiveClientService } from 'src/app/core/services/ms-massiveclient/massiveclient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CustomersAllListComponent } from '../customers-all-list/customers-all-list.component';
import { CustomersBlackListComponent } from '../customers-black-list/customers-black-list.component';
import { CustomersModalComponent } from '../customers-modal/customers-modal.component';
import { CustomersWhiteListComponent } from '../customers-white-list/customers-white-list.component';
import { CUSTOMERS_COLUMNS } from './customers-columns';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styles: [],
})
export class CustomersListComponent extends BasePage implements OnInit {
  customers: ICustomer[] = [];
  representative: IRepresentative[] = [];
  client: ICustomer;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private modalService: BsModalService,
    private customerService: CustomerService,
    private massiveClientService: MassiveClientService
  ) {
    super();
    this.settings.columns = CUSTOMERS_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.edit = true;
    this.settings.actions.add = false;
    this.settings.actions.delete = false;
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
              case 'rfc':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'street':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'city':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'colony':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'delegation':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'zipCode':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'country':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'fax':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'sellerId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'phone':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'mailWeb':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'state':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'curp':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'blackList':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'paternalSurname':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'maternalSurname':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'municipalityId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'stateId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'blackListDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'releaseDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'penaltyId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'personType':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'approvedRfc':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'userFree':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'freeDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'registryNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'economicAgreementKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'identificationType':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'identificationNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'agentId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'outsideNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'insideNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'password':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'user':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'interbankKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'bank':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'branch':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'checksAccount':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'penaltyInitDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'penalizeUser':
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
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  formatDate(dateString: string): string {
    if (dateString === '') {
      return '';
    }
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}` + 'T00:00:00.000Z';
  }

  //Fila seleccionada de la tabla de clientes
  rowsSelected(event: any) {
    this.client = event.data;
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.customerService.getAll(params).subscribe({
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

  //Modal para crear o editar clientes
  openFormClients(customers?: any) {
    const modalConfig = MODAL_CONFIG;
    if (customers) {
      customers = { ...customers, sellerId: customers.sellerId?.id ?? null };
    }
    modalConfig.initialState = {
      customers,
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(CustomersModalComponent, modalConfig);
  }

  //Abrir modal de lista negra
  openBlackList() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(CustomersBlackListComponent, modalConfig);
  }

  //Abrir modal de lista blanca
  openWhiteList() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(CustomersWhiteListComponent, modalConfig);
  }

  //Abrir modal con todos los clientes
  openAllClient() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(CustomersAllListComponent, modalConfig);
  }

  showDeleteAlert(customer: ICustomer) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar Este Cliente?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(customer);
      }
    });
  }

  delete(customer: ICustomer) {
    this.customerService.remove(customer.id).subscribe({
      next: response => {
        this.alert('success', 'Cliente Eliminado Correctamente', '');
      },
      error: err => {
        this.alert('warning', 'No se Puede Eliminar el Cliente', '');
      },
    });
  }
}

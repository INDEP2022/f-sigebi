import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ICustomersPenalties } from 'src/app/core/models/catalogs/customer.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CustomersPenaltiesExportAllComponent } from '../customer-penalties-export-all/customer-penalties-export-all.component';
import { CustomerPenaltiesModalComponent } from '../customer-penalties-modal/customer-penalties-modal.component';
import { COLUMNS, COLUMNS2 } from './columns';
import { CustomersPenalitiesFormComponent } from './customers-penalities-form/customers-penalities-form.component';
import { CustomersExportHistoryCustomersPenaltiesListComponent } from './history-customers-penalties/customers-export-HistoryCustomersPenalties-list/cus-exp-HisCusPen.component';

@Component({
  selector: 'app-customers-penalties',
  templateUrl: './customers-penalties.component.html',
  styles: [],
})
export class CustomersPenaltiesComponent extends BasePage implements OnInit {
  customersPenalties: ICustomersPenalties[] = [];
  totalItems: number = 0;
  totalItems2: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  columnFilters2: any = [];
  penalties: ICustomersPenalties;
  user: any;
  eventPenalities: any;

  permission: boolean = false;
  selectRow: boolean = false;

  settings2 = { ...this.settings };

  constructor(
    private modalService: BsModalService,
    private clientPenaltyService: ClientPenaltyService,
    private authService: AuthService,
    private securityService: SecurityService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.hideSubHeader = false;
    /*this.settings.actions.add = false;
    this.settings.actions.edit = true;
    this.settings.actions.delete = false;
    this.settings.actions.position = 'right';*/
    this.settings.actions = false;

    this.settings2.columns = COLUMNS2;
    this.settings2.actions = false;
    this.settings2.hideSubHeader = false;
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
            console.log('Hola');
            switch (filter.field) {
              case 'typeProcess':
                searchFilter = SearchFilter.EQ;
                break;
              case 'eventId':
                field = `filter.${filter.field}.id`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'publicLot':
                searchFilter = SearchFilter.EQ;
                break;

              /*case 'startDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'startDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              /*case 'endDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'endDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'refeOfficeOther':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'userPenalty':
                searchFilter = SearchFilter.ILIKE;
                break;
              /*case 'penaltiDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }*/
              case 'penaltiDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDeductives();
        }
      });

    this.data2
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
              case 'processType':
                searchFilter = SearchFilter.EQ;
                break;
              case 'eventId':
                //field = `filter.${filter.field}.id`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'batchPublic':
                searchFilter = SearchFilter.ILIKE;
                break;
              /*case 'initialDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'initialDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              /*case 'finalDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'finalDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'referenceJobOther':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'causefree':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'usrPenalize':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'usrfree':
                searchFilter = SearchFilter.ILIKE;
                break;
              /*case 'penalizesDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'penalizesDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              /*case 'releasesDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'releasesDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());

    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());

    const user: any = this.authService.decodeToken() as any;
    this.user = user.username;
    console.log(this.user);
    this.validateUser();
  }

  getData(id?: string | number) {
    /*if (id) {
      this.params2.getValue()['filter.customerId'] = `$eq:${id}`;
    }*/
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    this.clientPenaltyService.getAllHist(params).subscribe({
      next: response => {
        this.customersPenalties = response.data;
        this.data2.load(response.data);
        this.data2.refresh();
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data2.load([]);
        this.data2.refresh();
        this.totalItems2 = 0;
      },
    });
  }

  exportAllHistoryCustomersPenalties(event?: any) {
    console.log(event);
    /*if (!this.penalties) {
      this.alert(
        'warning',
        'Selecciona Primero un Cliente Para Exportar su Histórico de Penalizaciones',
        ''
      );
    } else {
      //Modal de exportación pendiente de crear
      const clientId = this.penalties.clientId.id;
      const modalConfig = MODAL_CONFIG;
      modalConfig.initialState = {
        clientId,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      };
      this.modalService.show(
        CustomersExportHistoryCustomersPenaltiesListComponent,
        modalConfig
      );
    }*/
    //const clientId = this.penalties.clientId.id;
    //clientId,
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(
      CustomersExportHistoryCustomersPenaltiesListComponent,
      modalConfig
    );
  }

  formatDate(dateString: string): string {
    if (dateString === '') {
      return '';
    }

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  rowsSelected(event: any) {
    if (event) {
      this.selectRow = true;
      this.eventPenalities = event.data;
      this.penalties = event.data;
      console.log(this.penalties);
    } else {
      this.eventPenalities = null;
    }
  }

  getDeductives() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log(params);
    this.clientPenaltyService.getAllV2(params).subscribe({
      next: response => {
        if (response.count > 0) {
          this.customersPenalties = response.data;
          this.totalItems = response.count;
          this.data.load(response.data);
          console.log(this.data);
          this.data.refresh();
          this.loading = false;
        } else {
          this.loading = false;
          this.data.load([]);
          this.data.refresh();
          this.totalItems = 0;
        }
      },
      error: error => {
        //this.loading = false;
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  //Modal para crear o editar clientes penalizados
  /*openForm(customersPenalties?: ICustomersPenalties) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      customersPenalties,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(CustomerPenaltiesModalComponent, modalConfig);
  }*/

  validateUser() {
    this.params1.getValue()['filter.user'] = `$eq:${this.user}`;
    let params = {
      ...this.params1.getValue(),
    };
    this.securityService.getFilterAllUsersTrackerV2(params).subscribe({
      next: resp => {
        this.permission = true;
      },
      error: err => {
        this.alert('warning', 'Usuario no Autorizado', 'No tiene los permisos');
      },
    });
  }

  openForm(customersPenalties?: any) {
    this.alertQuestion(
      'warning',
      'Penalizar',
      '¿Desea Penalizar un Cliente?'
    ).then(question => {
      if (question.isConfirmed) {
        const modalConfig = MODAL_CONFIG;
        modalConfig.initialState = {
          customersPenalties,
          callback: (next: boolean) => {
            if (next) this.getDeductives();
          },
        };
        this.modalService.show(CustomerPenaltiesModalComponent, modalConfig);
      }
    });
  }

  openFormUpdate(customersPenalties?: any) {
    this.alertQuestion('warning', 'Liberar', '¿Desea Liberar al Cliente?').then(
      question => {
        if (question.isConfirmed) {
          if (this.user) {
            this.params1.getValue()['filter.user'] = `$eq:${this.user}`;
            let params = {
              ...this.params1.getValue(),
            };
            this.securityService.getFilterAllUsersTrackerV2(params).subscribe({
              next: resp => {
                const modalConfig = MODAL_CONFIG;
                const userLog = this.user;
                modalConfig.initialState = {
                  customersPenalties,
                  userLog,
                  callback: (next: boolean) => {
                    if (next) {
                      this.getDeductives();
                      this.getData();
                      //this.penalties;
                    }
                  },
                };
                this.modalService.show(
                  CustomersPenalitiesFormComponent,
                  modalConfig
                );
              },
              error: err => {
                this.alert(
                  'warning',
                  'Usuario no Autorizado',
                  'No tiene los permisos'
                );
              },
            });
          }
        }
      }
    );
  }

  //Abrir modal de todos los penalizados
  openAllCustomersPenalties() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(CustomersPenaltiesExportAllComponent, modalConfig);
  }

  showDeleteAlert(customersPenalties: ICustomersPenalties) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(customersPenalties.id);
      }
    });
  }

  delete(id: number) {
    this.clientPenaltyService.remove(id).subscribe({
      next: () => {
        this.getDeductives();
        this.alert('success', 'Penalizacion', 'Borrado Correctamente');
      },
    });
  }
}

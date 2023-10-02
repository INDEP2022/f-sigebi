import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExpenseService } from 'src/app/core/services/ms-expense_/good-expense.service';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { MODAL_CONFIG } from '../../../../../common/constants/modal-config';
import { TABLE_SETTINGS } from '../../../../../core/shared/base-page';
import { CentralizedExpensesModalComponent } from '../centralized-expenses-modal/centralized-expenses.modal.component';
import { CENTRALIZED_EXPENSES_COLUMNS } from './centralized-expenses-columns';

@Component({
  selector: 'app-centralized-expenses',
  templateUrl: './centralized-expenses.component.html',
  styles: [],
})
export class CentralizedExpensesComponent extends BasePage implements OnInit {
  expenses: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();

  user1 = new DefaultSelect();

  nameUser: any;

  columnFilters: any = [];

  settingsCol = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      add: false,
      delete: false,
      position: 'right',
    },
  };

  constructor(
    private expenseService: ExpenseService,
    private pentService: SpentService,
    private modalService: BsModalService,
    private usersService: UsersService
  ) {
    super();
    this.settingsCol.columns = CENTRALIZED_EXPENSES_COLUMNS;
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
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'movement':
                field = 'filter.id';
                console.log('ENTRA A MOVEMENT');
                searchFilter = SearchFilter.EQ;
                break;
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'expenseConceptNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'amount':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'exercisedDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'user':
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
          this.getExpenses();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExpenses());
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  getExpenses() {
    this.expenses = [];
    this.data.refresh();
    const _params: any = [];
    this.loading = true;

    this.params.getValue()['filter.dirInd'] = '$ilike:I';
    this.params.getValue()['filter.isAddition'] = '$ilike:N';
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log('Params Completos-> ', params);
    this.pentService.getExpenditureExpended(params).subscribe(
      response => {
        for (let i = 0; i < response.data.length; i++) {
          //this.lawyers = response.data;
          if (response.data[i].expenseConceptNumber != null) {
            _params['filter.notConceptSpent'] =
              response.data[i].expenseConceptNumber != null
                ? response.data[i].expenseConceptNumber
                : 0;
            console.log('_Params-> ', _params);
            this.expenseService.getExpenseConcep(_params).subscribe({
              next: resp => {
                if (response.data[i].user != null) {
                  this.usersService
                    .getAllSegUsersbykey(response.data[i].user)
                    .subscribe(
                      user => {
                        console.log('Resp getExpenseConcep-> ', resp);
                        console.log('UserName-> ', user);
                        let item = {
                          id: response.data[i].id,
                          expenseConceptNumber:
                            response.data[i].expenseConceptNumber,
                          description:
                            resp.data[0].description != null
                              ? resp.data[0].description
                              : null,
                          amount: response.data[i].amount,
                          exercisedDate: this.formatDate(
                            new Date(response.data[i].exercisedDate)
                          ),
                          user: response.data[i].user,
                          userName: user.data[0].name,
                        };
                        console.log('response ', response);
                        console.log('Item 1-> ', item);
                        this.expenses.push(item);
                        this.data.load(this.expenses);
                        this.data.refresh();
                        console.log('this.expenses -->', this.expenses);
                        console.log('this.data2 -->', this.data);
                      },
                      err => {
                        this.alert('error', '', 'No existe la descripción');
                      }
                    );
                } else {
                  let item = {
                    id: response.data[i].id,
                    expenseConceptNumber: response.data[i].expenseConceptNumber,
                    description:
                      resp.data[0].description != null
                        ? resp.data[0].description
                        : null,
                    amount: response.data[i].amount,
                    exercisedDate: this.formatDate(
                      new Date(response.data[i].exercisedDate)
                    ),
                    user: response.data[i].user,
                    userName: response.data[i].user,
                  };
                  console.log('response ', response);
                  console.log('Item 2-> ', item);
                  this.expenses.push(item);
                  this.data.load(this.expenses);
                  this.data.refresh();
                  console.log('this.expenses -->', this.expenses);
                  console.log('this.data2 -->', this.data);
                }
              },
            });
          } else {
            let item = {
              id: response.data[i].id,
              expenseConceptNumber: response.data[i].expenseConceptNumber,
              description: '',
              amount: response.data[i].amount,
              exercisedDate: this.formatDate(
                new Date(response.data[i].exercisedDate)
              ),
              user: response.data[i].user,
            };
            console.log('response ', response);
            this.expenses.push(item);
            this.data.load(this.expenses);
            this.data.refresh();
            console.log('this.expenses -->', this.expenses);
            console.log('this.data2 -->', this.data);
          }
        }

        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  openModal2(data?: any) {
    console.log('event data', data);
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CentralizedExpensesModalComponent, config);
  }

  openModal(newOrEdit?: any) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      newOrEdit,
      //bank,
      //additionalData: { selectedRow: this.selectedRow },
      callback: (next: boolean) => {
        //if (next) this.getMovementsAccount();
      },
    };
    this.modalService.show(CentralizedExpensesModalComponent, modalConfig);
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  loadUser(data: any) {
    this.usersService.getAllSegUsersbykey(data).subscribe({
      next: resp => {
        console.log('getAllSegUser1-> ', resp);
        this.user1 = new DefaultSelect(resp.data, resp.count);
        this.nameUser = resp.data[0].name;
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }
}

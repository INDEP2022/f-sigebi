import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExpenseService } from 'src/app/core/services/ms-expense_/good-expense.service';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MODAL_CONFIG } from '../../../../../common/constants/modal-config';
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

  constructor(
    private expenseService: ExpenseService,
    private pentService: SpentService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = CENTRALIZED_EXPENSES_COLUMNS;
    this.settings.actions = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExpenses());
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  getExpenses() {
    const _params: any = [];
    this.loading = true;
    this.pentService.getExpenditureExpended(this.params.getValue()).subscribe(
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
                console.log('Resp getExpenseConcep-> ', resp);
                let item = {
                  num: response.data[i].id,
                  concept: response.data[i].expenseConceptNumber,
                  description:
                    resp.data[0].description != null
                      ? resp.data[0].description
                      : null,
                  import: response.data[i].amount,
                  date: this.formatDate(
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
              },
              error: err => {
                this.alert('error', '', 'No existe la descripción');
              },
            });
          } else {
            let item = {
              num: response.data[i].id,
              concept: response.data[i].expenseConceptNumber,
              description: '',
              import: response.data[i].amount,
              date: this.formatDate(new Date(response.data[i].exercisedDate)),
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
}

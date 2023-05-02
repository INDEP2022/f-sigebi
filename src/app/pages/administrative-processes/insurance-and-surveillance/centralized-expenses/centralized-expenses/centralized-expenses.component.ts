import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
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
  constructor() {
    super();
    this.settings.columns = CENTRALIZED_EXPENSES_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExpenses());
  }

  getExpenses() {
    // this.loading = true;
    // this.bankService.getAll(this.params.getValue()).subscribe(
    //   response => {
    //     this.lawyers = response.data;
    //     this.totalItems = response.count;
    //     this.loading = false;
    //   },
    //   error => (this.loading = false)
    // );
  }
}

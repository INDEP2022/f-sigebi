import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_EXPENSES } from '../jp-d-t-c-trials/columns';

@Component({
  selector: 'app-jp-d-t-c-expenses-set',
  templateUrl: './jp-d-t-c-expenses-set.component.html',
  styles: [],
})
export class JpDTCExpensesSetComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any[] = [
    {
      dateExpenses: '29/10/2021',
      concept: 'Concepto del primer item',
      amount: '20.000',
    },
    {
      dateExpenses: '29/10/2021',
      concept: 'Concepto del primer item',
      amount: '20.000',
    },
    {
      dateExpenses: '29/10/2021',
      concept: 'Concepto del primer item',
      amount: '20.000',
    },
    {
      dateExpenses: '29/10/2021',
      concept: 'Concepto del primer item',
      amount: '20.000',
    },
    {
      dateExpenses: '29/10/2021',
      concept: 'Concepto del primer item',
      amount: '20.000',
    },
  ];
  constructor() {
    super();
    this.settings.columns = COLUMNS_EXPENSES;
    this.settings.actions = false;
  }

  ngOnInit(): void {}
}

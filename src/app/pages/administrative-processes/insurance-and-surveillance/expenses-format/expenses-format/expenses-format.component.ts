import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { EXPENSES_FORMAT_COLUMNS } from './expenses-format-columns';

@Component({
  selector: 'app-expenses-format',
  templateUrl: './expenses-format.component.html',
  styles: [],
})
export class ExpensesFormatComponent extends BasePage implements OnInit {
  data: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: EXPENSES_FORMAT_COLUMNS,
    };
  }

  ngOnInit(): void {}
}

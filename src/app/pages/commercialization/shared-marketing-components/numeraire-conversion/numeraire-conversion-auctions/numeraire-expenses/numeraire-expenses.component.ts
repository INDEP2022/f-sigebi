import { Component, OnInit } from '@angular/core';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';

@Component({
  selector: 'app-numeraire-expenses',
  templateUrl: './numeraire-expenses.component.html',
  styleUrls: ['./numeraire-expenses.component.css'],
})
export class NumeraireExpensesComponent
  extends BasePageTableNotServerPagination
  implements OnInit
{
  constructor() {
    super();
  }
}

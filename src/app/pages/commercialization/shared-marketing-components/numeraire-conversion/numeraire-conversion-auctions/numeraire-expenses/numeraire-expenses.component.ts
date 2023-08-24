import { Component, OnInit } from '@angular/core';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
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
  constructor(private dataService: SpentService) {
    super();
  }
}

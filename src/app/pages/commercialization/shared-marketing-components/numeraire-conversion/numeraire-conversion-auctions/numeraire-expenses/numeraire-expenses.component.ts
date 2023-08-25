import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
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
  @Input() event: { id: string; statusVtaId: string };
  constructor(private dataService: SpentService) {
    super();
  }

  override getData() {
    if (!this.event) return;
    // let params = this.getParams();
    this.dataService
      .fillExpenses({
        idEvent: this.event.id,
        idStatusVta: this.event.statusVtaId,
      })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);
        },
      });
  }
}

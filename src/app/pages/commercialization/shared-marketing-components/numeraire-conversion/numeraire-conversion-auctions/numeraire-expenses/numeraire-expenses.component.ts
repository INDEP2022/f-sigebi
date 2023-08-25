import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-numeraire-expenses',
  templateUrl: './numeraire-expenses.component.html',
  styleUrls: ['./numeraire-expenses.component.scss'],
})
export class NumeraireExpensesComponent
  extends BasePageTableNotServerPagination
  implements OnInit
{
  toggleInformation = true;
  @Input() event: { id: string; statusVtaId: string };
  constructor(private dataService: SpentService) {
    super();
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
    };
  }

  override getData() {
    if (!this.event) return;
    // let params = this.getParams();
    this.loading = true;
    this.dataService
      .fillExpenses({
        idEvent: this.event.id,
        idStatusVta: this.event.statusVtaId,
      })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.totalItems = response.combined.length;
            this.dataTemp = [...response.combined];
            this.getPaginated(this.params.value);
            this.loading = false;
          } else {
            this.notGetData();
          }

          console.log(response);
        },
        error: err => {
          this.notGetData();
        },
      });
  }
}

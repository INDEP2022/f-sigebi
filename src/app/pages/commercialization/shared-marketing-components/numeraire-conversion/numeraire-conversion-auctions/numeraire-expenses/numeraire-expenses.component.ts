import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { IFillExpenseDataCombined } from 'src/app/core/models/ms-spent/comer-expense';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-numeraire-expenses',
  templateUrl: './numeraire-expenses.component.html',
  styleUrls: ['./numeraire-expenses.component.scss'],
})
export class NumeraireExpensesComponent
  extends BasePageTableNotServerPagination<IFillExpenseDataCombined>
  implements OnInit
{
  toggleInformation = true;
  total = 0;
  @Input() event: IComerEvent;
  @Input() reload = 0;
  @Output() selectedRow = new EventEmitter<IFillExpenseDataCombined>();
  constructor(private dataService: SpentService) {
    super();
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
      actions: false,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['reload'] &&
      changes['reload'].currentValue &&
      changes['reload'].currentValue > 0
    ) {
      this.getData();
    }
  }

  override getData() {
    if (!this.event) return;
    // let params = this.getParams();
    this.loading = true;
    this.dataService
      .fillExpenses({
        idEvent: this.event.id + '',
        idStatusVta: this.event.statusVtaId,
      })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.totalItems = response.combined.length;
            this.total = +response.totevent.toFixed(2);
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

  selectExpense(row: IFillExpenseDataCombined) {
    this.selectedRow.emit(row);
  }
}

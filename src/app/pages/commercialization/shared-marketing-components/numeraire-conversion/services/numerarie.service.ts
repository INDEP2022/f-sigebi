import { Injectable } from '@angular/core';
import { Subject, take } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { IFillExpenseDataCombined } from 'src/app/core/models/ms-spent/comer-expense';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';

@Injectable({
  providedIn: 'root',
})
export class NumerarieService {
  updateAllowed: boolean;
  selectedEvent: IComerEvent = null;
  selectedEventSubject = new Subject<IComerEvent>();
  selectedExpenseData: IFillExpenseDataCombined;
  reloadExpenses = 0;
  showParcial = true;
  validParcial = true;
  constructor(
    private lotService: LotService,
    private comertpEventService: ComerTpEventosService
  ) {}

  validateParcialButtons(address: string, event: IComerEvent) {
    if (address === 'I') {
      this.validParcial = true;
      const filterParams = new FilterParams();
      filterParams.addFilter('idStatusVta', 'GARA');
      filterParams.addFilter('idEvent', event.id);
      this.lotService
        .getAll(filterParams.getParams())
        .pipe(take(1))
        .subscribe({
          next: response => {
            if (response && response.data && response.data.length === 0) {
              this.validParcial = false;
            }
          },
          error: err => {
            this.validParcial = false;
          },
        });
    }
  }
}

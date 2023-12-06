import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { IFillExpenseDataCombined } from 'src/app/core/models/ms-spent/comer-expense';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';

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
  constructor(private comertpEventService: ComerTpEventosService) {}
}

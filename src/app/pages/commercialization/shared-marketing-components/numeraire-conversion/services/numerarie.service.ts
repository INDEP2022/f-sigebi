import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';

@Injectable({
  providedIn: 'root',
})
export class NumerarieService {
  updateAllowed: boolean;
  selectedEvent: IComerEvent = null;
  selectedEventSubject = new Subject<IComerEvent>();
  constructor() {}
}

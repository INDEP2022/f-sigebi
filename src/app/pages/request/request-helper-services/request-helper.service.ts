import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestHelperService {
  private refresh = new BehaviorSubject<any>(undefined);
  currentRefresh = this.refresh.asObservable();

  private expedient = new BehaviorSubject<any>(undefined);
  currentExpedient = this.expedient.asObservable();

  constructor() {}

  isComponentSaving(menaje: boolean) {
    this.refresh.next(menaje);
  }

  associateExpedient(state: boolean) {
    this.expedient.next(state);
  }
}

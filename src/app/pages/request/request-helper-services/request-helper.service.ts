import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestHelperService {
  private refresh = new BehaviorSubject<any>(undefined);
  currentRefresh = this.refresh.asObservable();

  constructor() {}

  isComponentSaving(menaje: boolean) {
    this.refresh.next(menaje);
  }
}

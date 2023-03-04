import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class showHideErrorInterceptorService {
  private showError = new BehaviorSubject<boolean>(true);
  constructor() {}

  showHideError(value: boolean) {
    this.showError.next(value);
  }

  getValue() {
    let resp: boolean;
    this.showError.subscribe(value => {
      resp = value;
    });
    return resp;
  }
}

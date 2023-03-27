import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class showHideErrorInterceptorService {
  private showError = new BehaviorSubject<boolean>(true);
  private _blockAllErrors: boolean = false; //Bloque permanente errores si esta en true hasta que vuelva a establecerse falso manualmente
  constructor() {}

  get blockAllErrors() {
    return this._blockAllErrors;
  }
  set blockAllErrors(condition: boolean) {
    this._blockAllErrors = condition;
  }

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

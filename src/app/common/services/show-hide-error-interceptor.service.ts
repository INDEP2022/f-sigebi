import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class showHideErrorInterceptorService implements OnInit {
  private showError = new BehaviorSubject<boolean>(true);
  private _blockAllErrors: boolean = false; //Bloque permanente errores si esta en true hasta que vuelva a establecerse falso manualmente
  constructor() {}

  get blockAllErrors() {
    return this._blockAllErrors;
  }
  set blockAllErrors(condition: boolean) {
    this._blockAllErrors = condition;
  }

  ngOnInit(): void {
    this._blockAllErrors = false;
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

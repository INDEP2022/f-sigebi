import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Injectable({
  providedIn: 'root',
})
export class BillingCommunicationService {
  private ejecutarFuncionSource = new Subject<any>();
  ejecutarFuncion$ = this.ejecutarFuncionSource.asObservable();
  private params = new BehaviorSubject<any>(ListParams);

  getParams() {
    return this.params.asObservable();
  }

  setParams(params: any) {
    this.params.next(params);
  }

  enviarParams(val: any) {
    console.log('data', val);
    return this.ejecutarFuncionSource.next(val);
  }
}
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillingCommunicationService {
  private ejecutarFuncionSource = new Subject<any>();
  private dataSeleccionadaSource = new Subject<any[]>();
  private changeValSelectSource = new Subject<boolean>();
  ejecutarFuncion$ = this.ejecutarFuncionSource.asObservable();
  dataSeleccionada$ = this.dataSeleccionadaSource.asObservable();
  changeValSelect$ = this.changeValSelectSource.asObservable();

  async enviarParams(params: any) {
    console.log('data', params);
    return this.ejecutarFuncionSource.next(params);
  }

  async enviarDataSeleccionada(data: any) {
    console.log('dataSelecionada', data);
    return this.dataSeleccionadaSource.next(data);
  }

  async changeValSelect(val: boolean) {
    console.log('val', val);
    return this.changeValSelectSource.next(val);
  }
}

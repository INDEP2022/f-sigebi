import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExportCommunicationService {
  private ejecutarFuncionSource = new Subject<any>();
  ejecutarFuncion$ = this.ejecutarFuncionSource.asObservable();

  async enviarParams(val: boolean) {
    console.log('data', val);
    return this.ejecutarFuncionSource.next(val);
  }
}

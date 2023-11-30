import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActasConvertionCommunicationService {
  private ejecutarFuncionSource = new Subject<any>();

  constructor() {}

  ejecutarFuncion$ = this.ejecutarFuncionSource.asObservable();

  ejecutarFuncion(data: boolean) {
    console.log('data', data);
    return this.ejecutarFuncionSource.next(data);
  }
}

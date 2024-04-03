import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FractionSelectedService {
  /*private valorCompartidoSource = new BehaviorSubject<any>(0);
  valorCompartido$ = this.valorCompartidoSource.asObservable();

  actualizarValorCompartido(nuevoValor: any) {
    this.valorCompartidoSource.next(nuevoValor);
  }*/

  private valorCompartidoSource = new BehaviorSubject<number>(0);
  valorCompartido$ = this.valorCompartidoSource.asObservable();

  constructor() {}

  updateShareValue(nuevoValor: number) {
    this.valorCompartidoSource.next(nuevoValor);
  }
}

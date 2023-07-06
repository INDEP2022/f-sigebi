import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProccesNum } from 'src/app/core/models/ms-numerary/numerary.model';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private process$: Subject<IProccesNum>;

  process(mensaje: IProccesNum) {
    console.log('Emitiendo...');
    this.process$.next(mensaje);
  }

  getProcess() {
    return this.process$.asObservable();
  }
  constructor() {
    this.process$ = new Subject<IProccesNum>();
  }
}

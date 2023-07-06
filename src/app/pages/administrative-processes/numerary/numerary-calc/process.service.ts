import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProccesNum } from 'src/app/core/models/ms-numerary/numerary.model';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';

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
  constructor(private readonly numeraryService: NumeraryService) {
    this.process$ = new Subject<IProccesNum>();
  }

  createProccesNum(userAuth: string, procnumType: string) {
    return new Promise<IProccesNum>((res, _rej) => {
      const model: IProccesNum = {
        procnumDate: this.obtenerFechaActual(),
        description: '  ',
        interestAll: 0,
        numeraryAll: 0,
        procnumType: procnumType, ///this.form.get('type').value,
        user: userAuth,
      };
      console.log(model);
      this.numeraryService.createProccesNum(model).subscribe({
        next: (response: any) => {
          console.log(response);
          this.process(response);
          res(response);
        },
        error: err => {
          res(null);
        },
      });
    });
  }

  obtenerFechaActual(): string {
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const day = String(fechaActual.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

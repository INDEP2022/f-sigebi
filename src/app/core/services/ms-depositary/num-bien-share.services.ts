import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';

export interface valorBien {
  numBien: number;
  nomPantall: string;
}

@Injectable({ providedIn: 'root' })
export class NumBienShare extends HttpService {
  private sharingNumbien: BehaviorSubject<valorBien> =
    new BehaviorSubject<valorBien>({ numBien: 10, nomPantall: 'string' });

  get SharingNumbien() {
    return this.sharingNumbien.asObservable();
  }

  set SharingNumbienData(data: valorBien) {
    this.sharingNumbien.next(data);
  }

  /*
http://localhost:4200/pages/juridical/depositary/payment-dispersion-process/query-related-payments-depositories/3801
FCONDEPODISPAGOS-Validación de Pagos

*/
}

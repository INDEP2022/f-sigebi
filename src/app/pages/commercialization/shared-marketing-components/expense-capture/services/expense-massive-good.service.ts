import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseMassiveGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = 'massivegood';
  }

  PUP_EXPOR_ARCHIVO_BASE(idGasto: number) {
    return this.get<string>('application/pup-export-file-base/' + idGasto);
  }
}

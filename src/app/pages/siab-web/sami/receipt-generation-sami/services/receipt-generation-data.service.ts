import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EReceiptType } from '../models/eReceiptType';

@Injectable({
  providedIn: 'root',
})
export class ReceiptGenerationDataService {
  folio: string = 'R-METROPOLITANA-SAT-24-OS';
  recibos = 0;
  resguardo = 0;
  almacen = 0;
  programacion = 0;
  cancelacion = 0;
  typeReceiptSelected: EReceiptType;
  refreshTableProgrammings = new Subject();
  constructor() {}
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EReceiptType } from '../models/eReceiptType';
import { IReceiptItem } from '../receipt-table-goods/ireceipt';

@Injectable({
  providedIn: 'root',
})
export class ReceiptGenerationDataService {
  recibos = 0;
  resguardo = 0;
  almacen = 0;
  programacion = 0;
  cancelacion = 0;
  typeReceiptSelected: EReceiptType;
  refreshTableProgrammings = new Subject();
  refreshAll = new Subject();
  selectedGoods: IReceiptItem[] = [];
  constructor() {}
}

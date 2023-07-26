import { Component, OnInit } from '@angular/core';
import { EReceiptType } from '../models/eReceiptType';
import { ReceiptGenerationDataService } from '../services/receipt-generation-data.service';

@Component({
  selector: 'app-receipt-generation-sami',
  templateUrl: './receipt-generation-sami.component.html',
  styleUrls: ['./receipt-generation-sami.component.scss'],
})
export class ReceiptGenerationSamiComponent implements OnInit {
  estatus_bien_programacion: string;
  constructor(private receiptGenerationData: ReceiptGenerationDataService) {}

  ngOnInit(): void {}

  get recibos() {
    return this.receiptGenerationData.recibos;
  }

  get resguardo() {
    return this.receiptGenerationData.resguardo;
  }

  get almacen() {
    return this.receiptGenerationData.almacen;
  }

  get programacion() {
    return this.receiptGenerationData.programacion;
  }

  get cancelacion() {
    return this.receiptGenerationData.cancelacion;
  }

  get typeReceiptSelected() {
    return this.receiptGenerationData.typeReceiptSelected;
  }

  isFirstTable() {
    if (this.typeReceiptSelected === 'RECIBO') return true;
    if (this.typeReceiptSelected === 'RESGUARDO') return true;
    if (this.typeReceiptSelected === 'ALMACEN') return true;
    return false;
  }

  showTableByTiporecibo(type: EReceiptType) {
    this.receiptGenerationData.typeReceiptSelected = type;
    if (this.isFirstTable()) {
      this.receiptGenerationData.refreshTableProgrammings.next(true);
    } else {
      if (type === EReceiptType.Cancelación) {
        this.estatus_bien_programacion = 'CANCELADO_TMP';
      } else {
        this.estatus_bien_programacion = 'EN_PROGRAMACION_TMP';
      }
    }
  }
}

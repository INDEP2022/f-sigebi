import { Component, Input, OnInit } from '@angular/core';
import { IEntryOrder } from '../../../../../core/models/requests/entryOrder.model';

@Component({
  selector: 'app-entry-order-view',
  templateUrl: './entry-order-view.component.html',
  styleUrls: ['./entry-order-view.component.scss'],
})
export class EntryOrderViewComponent implements OnInit {
  @Input() requestId: number;
  entryOrder: IEntryOrder;

  constructor() {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    //Llamar servicio para obtner informacion de la orden de ingreso
    this.entryOrder = {
      administrativeUnit: 'NORTE',
      orderDate: '19/04/2018',
      concept: 'RESARCIMIENTO ECONÓMICO',
      paymentMethod: 'CHEQUE',
      amount: 30000,
      referenceNo: 435352353454,
      bank: 'BANAMEX',
    };
  }
}

import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { IEntryOrder } from '../../../../../core/models/requests/entryOrder.model';

@Component({
  selector: 'app-entry-order-view',
  templateUrl: './entry-order-view.component.html',
  styleUrls: ['./entry-order-view.component.scss'],
})
export class EntryOrderViewComponent implements OnInit {
  @Input() requestId: number;
  entryOrder: IEntryOrder;

  private entryOrderService = inject(orderentryService);

  constructor() {}

  ngOnInit(): void {
    this.getAllOrderEntry();
    //this.getData();
  }

  getAllOrderEntry() {
    // Llamar servicio para obtener informacion de la documentacion de la orden
    const params = new ListParams();
    params['filter.identifier'] = `$eq:${this.requestId}`;
    this.entryOrderService
      .getAllOrderEntry(params)
      .pipe(
        map(x => {
          return x.data[0];
        })
      )
      .subscribe({
        next: resp => {
          console.log(resp);
          this.entryOrder = {
            unitadministrative: resp.unitadministrative.toString(),
            orderDate: new DatePipe('en-US').transform(
              resp.orderDate,
              'dd/MM/yyyy'
            ),
            concept: resp.concept,
            paymentMethod: resp.shapePay,
            amount: resp.amount,
            referenceNo: resp.numberreference,
            bank: resp.accountBank,
          };
        },
      });
  }
}

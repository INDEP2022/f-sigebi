import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SERVICE_ORDER_COLUMNS } from '../../columns/service-order-columns';

@Component({
  selector: 'app-tranportable-goods-form',
  templateUrl: './tranportable-goods-form.component.html',
  styles: [],
})
export class TranportableGoodsFormComponent extends BasePage implements OnInit {
  data: any[] = [];

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor() {
    super();

    this.settings = {
      ...this.settings,
      columns: SERVICE_ORDER_COLUMNS,
      edit: {
        editButtonContent: '<i class="bx bxs-file-doc"></i> Ver ',
      },
    };

    this.data = [
      {
        numberGestion: 546456,
        uniqueKey: 32423,
        descriptionGoodTransferent: 'Estampillas',
        transerUnitMeasure: 'Pieza',
        quantity: 1,
        expedientTransferent: '',
        physicalState: 'Bueno',
        stateConservation: 'Bueno',
        address: 'Ciudad de México',
        numberExpedient: 331,
        typeGood: 'Joyas obras',
      },
    ];
  }

  ngOnInit(): void {}

  showDocument() {}
}

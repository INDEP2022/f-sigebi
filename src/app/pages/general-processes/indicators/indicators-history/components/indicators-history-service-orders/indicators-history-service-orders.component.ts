import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { INDICATORS_HISTORY_SERVICE_COLUMNS } from './indicators-history-service-columns';

@Component({
  selector: 'app-indicators-history-service-orders',
  templateUrl: './indicators-history-service-orders.component.html',
  styles: [],
})
export class IndicatorsHistoryServiceOrdersComponent
  extends BasePage
  implements OnInit
{
  //

  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  //

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: { ...INDICATORS_HISTORY_SERVICE_COLUMNS },
    };
  }

  ngOnInit(): void {}

  //

  //
}

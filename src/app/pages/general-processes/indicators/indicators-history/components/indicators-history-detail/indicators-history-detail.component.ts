import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { INDICATORS_HISTORY_DETAIL_COLUMNS } from './indicators-history-datail-columns';

@Component({
  selector: 'app-indicators-history-detail',
  templateUrl: './indicators-history-detail.component.html',
  styles: [],
})
export class IndicatorsHistoryDetailComponent
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
      columns: { ...INDICATORS_HISTORY_DETAIL_COLUMNS },
    };
  }

  ngOnInit(): void {}

  //

  //
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { INDICATORS_HISTORY_COLUMNS } from './indicators-history-columns';

@Component({
  selector: 'app-indicators-history',
  templateUrl: './indicators-history.component.html',
  styles: [],
})
export class IndicatorsHistoryComponent extends BasePage implements OnInit {
  data: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columns: any[] = [];

  constructor(private viewService: GoodsQueryService) {
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
      columns: { ...INDICATORS_HISTORY_COLUMNS },
    };
  }

  ngOnInit(): void {}

  getData(params: any) {
    this.viewService.getViewIncRecDoc(params).subscribe({
      next: response => {
        console.log('Esto trae la respuesta: ', response.data);
        this.data = response.data;
        this.totalItems = response.count || 0;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICaptureDig } from 'src/app/core/models/ms-documents/documents';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { INDICATORS_HISTORY_COLUMNS } from './indicators-history-columns';

@Component({
  selector: 'app-indicators-history',
  templateUrl: './indicators-history.component.html',
  styles: [],
})
export class IndicatorsHistoryComponent extends BasePage implements OnInit {
  //

  @ViewChild('columnContent') columnContent: ElementRef;
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columns: ICaptureDig[] = [];
  danger: boolean = false;

  //
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
        this.columns = response.data;
        this.valueImg(this.columns);
        this.data.load(this.columns);
        this.totalItems = response.count || 0;
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  onContentRender(event: any) {
    if (this.columnContent && this.columnContent.nativeElement) {
      const column5Values = this.columns.map(row => row.column5 || '');
      this.columnContent.nativeElement.innerHTML = column5Values.join('');
    }
  }

  valueImg(columns: ICaptureDig[]) {
    for (const i of columns) {
      if (i.fescaneo == null) {
        i.column5 = 'No Cumplido';
      } else if (i.cant_bien != 0) {
        i.column5 = 'Cumplido';
      } else {
        i.column5 = 'Destiempo';
      }
    }
  }

  //
}

import { Component, Input, OnChanges } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICaptureHistoryIndicators } from 'src/app/core/models/ms-documents/documents';
import { HistoryIndicatorService } from 'src/app/core/services/ms-history-indicator/history-indicator.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { INDICATORS_HISTORY_DETAIL_COLUMNS } from './indicators-history-datail-columns';

export class LocalViewIndicators {
  proceedingsNum: number;
  flierNum: number;
}

@Component({
  selector: 'app-indicators-history-detail',
  templateUrl: './indicators-history-detail.component.html',
  styles: [],
})
export class IndicatorsHistoryDetailComponent
  extends BasePage
  implements OnChanges
{
  //

  @Input() noVolante: number;
  @Input() noExpediente: number;
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columns: ICaptureHistoryIndicators[] = [];

  //

  constructor(private serviceViewIndicators: HistoryIndicatorService) {
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

  ngOnChanges() {
    if (this.noVolante != 0 || this.noExpediente != 0) {
      this.getByFiltersViewHistIndicators();
    }
  }

  //

  getByFiltersViewHistIndicators() {
    this.loading = true;
    let local = new LocalViewIndicators();
    local.proceedingsNum = this.noExpediente;
    local.flierNum = this.noVolante;
    this.serviceViewIndicators
      .getHistoryIndicatorViewIndicators(local)
      .subscribe({
        next: (response: any) => {
          this.columns = response.data;
          this.data.load(this.columns);
          this.totalItems = response.count || 0;
          this.data.refresh();
          this.loading = false;
        },
        error: (error: any) => {
          this.loading = false;
        },
      });
  }

  //
}

import { Component, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICaptureHistoryIndicators } from 'src/app/core/models/ms-documents/documents';
import { HistoryIndicatorService } from 'src/app/core/services/ms-history-indicator/history-indicator.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { INDICATORS_HISTORY_DETAIL_COLUMNS } from './indicators-history-datail-columns';

export class LocalViewIndicators {
  flierNum: number;
  proceedingsNum: number;
}

@Component({
  selector: 'app-indicators-history-detail',
  templateUrl: './indicators-history-detail.component.html',
  styles: [],
})
export class IndicatorsHistoryDetailComponent extends BasePage {
  //

  @Input() noVolante: number;
  @Input() noExpediente: number;
  data: LocalDataSource = new LocalDataSource();
  callback: any;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columns: ICaptureHistoryIndicators[] = [];

  //

  constructor(
    private serviceViewIndicators: HistoryIndicatorService,
    public modalRef: BsModalService
  ) {
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

  ngOnInit() {
    this.callback = this.modalRef.config.initialState;
    this.data = new LocalDataSource();
    this.getByFiltersViewHistIndicators();
  }

  //

  getByFiltersViewHistIndicators() {
    let local = new LocalViewIndicators();
    local.flierNum = this.callback.data.flyerNumber;
    local.proceedingsNum = this.callback.data.fileNumber;
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

  close() {
    this.modalRef.hide();
  }

  //
}

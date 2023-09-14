import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodTrackerForm } from '../../utils/goods-tracker-form';

@Component({
  selector: 'certificates-filter',
  templateUrl: './certificates-filter.component.html',
  styles: [
    `
      .custom-tmp {
        font-size: 0.9em !important;
        margin-bottom: 5px !important;
        color: #333 !important;
        background-color: #ebf5ff !important;
        border-radius: 2px !important;
        margin-right: 5px !important;
      }

      .custom-icon {
        font-size: 0.9em !important;
        cursor: pointer;
        border-right: 1px solid #b8dbff !important;
        display: inline-block;
        padding: 1px 5px;
      }

      .custom-value-label {
        display: inline-block !important;
        padding: 1px 5px !important;
      }
    `,
  ],
})
export class CertificatesFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() form: FormGroup<GoodTrackerForm>;
  @Output() cleanFilters = new EventEmitter<void>();
  goodStatuses = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private historyGoodService: HistoryGoodService,
    private statusGoodService: StatusGoodService
  ) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }

  getGoodStatuses(params: ListParams) {
    params.limit = 100;
    params['sortBy'] = 'status:ASC';
    this.statusGoodService.getAll(params).subscribe({
      next: res => (this.goodStatuses = new DefaultSelect(res.data, res.count)),
      error: error => {
        this.goodStatuses = new DefaultSelect([], 0);
      },
    });
  }

  statusChange() {
    // const status = this.form.controls.receptionStatus.value;
    // if (status.length == 0) {
    //   return;
    // }
    // RECEPTION_STATUS.length = 0;
    // const params = new FilterParams();
    // params.addFilter('status', status, SearchFilter.IN);
    // this.historyGoodService.getAllFilter(params.getParams()).subscribe({
    //   next: res =>
    //     RECEPTION_STATUS.push(res.data.map(history => history.propertyNum)),
    // });
  }
}

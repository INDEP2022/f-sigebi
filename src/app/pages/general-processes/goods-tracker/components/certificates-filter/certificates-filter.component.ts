import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RECEPTION_STATUS } from '../../utils/constants/filter-match';
import { GoodTrackerForm } from '../../utils/goods-tracker-form';

@Component({
  selector: 'certificates-filter',
  templateUrl: './certificates-filter.component.html',
  styles: [],
})
export class CertificatesFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() form: FormGroup<GoodTrackerForm>;
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
    this.statusGoodService.getAll(params).subscribe({
      next: res => (this.goodStatuses = new DefaultSelect(res.data, res.count)),
    });
  }

  statusChange() {
    const status = this.form.controls.receptionStatus.value;
    if (status.length == 0) {
      return;
    }
    RECEPTION_STATUS.length = 0;
    const params = new FilterParams();
    params.addFilter('status', status, SearchFilter.IN);
    this.historyGoodService.getAllFilter(params.getParams()).subscribe({
      next: res =>
        RECEPTION_STATUS.push(res.data.map(history => history.propertyNum)),
    });
  }
}

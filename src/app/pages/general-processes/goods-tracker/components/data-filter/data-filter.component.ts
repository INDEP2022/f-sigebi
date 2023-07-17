import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  GoodTrackerForm,
  GOOD_PHOTOS_OPTIOS,
  PROCESSES,
  TARGET_IDENTIFIERS,
} from '../../utils/goods-tracker-form';

@Component({
  selector: 'data-filter',
  templateUrl: './data-filter.component.html',
  styles: [],
})
export class DataFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  photosOptions = GOOD_PHOTOS_OPTIOS;
  targetIdentifiers = TARGET_IDENTIFIERS;
  @Input() form: FormGroup<GoodTrackerForm>;
  @Input() params: FilterParams;
  @Input() subloading: boolean;
  @Output() subloadingChange = new EventEmitter<boolean>();
  labels = new DefaultSelect();
  @Output() cleanFilters = new EventEmitter<void>();
  goodStatuses = new DefaultSelect();
  processes = PROCESSES;
  constructor(
    private fb: FormBuilder,
    private goodLabelService: LabelOkeyService,
    private statusGoodService: StatusGoodService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }

  getGoodLabels(params: ListParams) {
    this.goodLabelService.getAll(params).subscribe({
      next: response =>
        (this.labels = new DefaultSelect(response.data, response.count)),
      error: () => {
        this.labels = new DefaultSelect([], 0);
      },
    });
  }

  getGoodStatuses(params: ListParams) {
    params.limit = 100;
    this.statusGoodService.getAll(params).subscribe({
      next: res => (this.goodStatuses = new DefaultSelect(res.data, res.count)),
      error: () => {
        this.goodStatuses = new DefaultSelect([], 0);
      },
    });
  }
}

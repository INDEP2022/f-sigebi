import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import {
  GoodTrackerForm,
  GOOD_PHOTOS_OPTIOS,
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
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }
}

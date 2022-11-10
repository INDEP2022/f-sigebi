import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  INDICATORS_COLUMNS2,
  INDICATORS_GOOD_COLUMNS1,
} from './indicators-columns';

@Component({
  selector: 'app-indicators-per-good',
  templateUrl: './indicators-per-good.component.html',
  styles: [],
})
export class IndicatorsPerGoodComponent extends BasePage implements OnInit {
  form: FormGroup;
  data1: any[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  settings1 = { ...this.settings, actions: false };
  data2: any[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;

  constructor(private fb: FormBuilder) {
    super();
    this.settings1 = {
      ...this.settings,
      actions: false,
      columns: INDICATORS_GOOD_COLUMNS1,
    };
    this.settings.columns = INDICATORS_COLUMNS2;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      good: [null, Validators.required],
      date: [null, Validators.required],
    });
  }
}

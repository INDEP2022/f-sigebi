import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { INDICATORS_SAT_COLUMNS } from './indicators-sat-columns';

@Component({
  selector: 'app-indicators-sat',
  templateUrl: './indicators-sat.component.html',
  styles: [],
})
export class IndicatorsSatComponent extends BasePage implements OnInit {
  indicatorSatForm: FormGroup;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: INDICATORS_SAT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.indicatorSatForm = this.fb.group({
      indicator: [null, Validators.required],
      regional: [null, Validators.required],
      year: [null, Validators.required],
      month: [null, Validators.required],
      a: [null, Validators.required],
      goodGuy: [null, Validators.required],
      byYear: [null, Validators.required],
      monthRange: [null, Validators.required],
    });
  }
}

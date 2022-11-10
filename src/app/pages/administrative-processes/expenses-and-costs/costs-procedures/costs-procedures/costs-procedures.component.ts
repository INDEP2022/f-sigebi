import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  CIFRA_PERIOD_COLUMNS,
  STATE_PERIOD_COLUMNS,
} from './state-period-columns';

@Component({
  selector: 'app-costs-procedures',
  templateUrl: './costs-procedures.component.html',
  styles: [],
})
export class CostsProceduresComponent extends BasePage implements OnInit {
  form: FormGroup;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  settings1 = { ...this.settings, actions: false };
  data2: any[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: STATE_PERIOD_COLUMNS,
    };
    this.settings1.columns = CIFRA_PERIOD_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      total1: [null],
      total2: [null],
    });
  }
}

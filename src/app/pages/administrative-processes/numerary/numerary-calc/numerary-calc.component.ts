import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  GOODS_COLUMNS,
  REQUESTS_COLUMNS,
  TOTALS_COLUMNS,
} from './numerary-calc-columns';

@Component({
  selector: 'app-numerary-calc',
  templateUrl: './numerary-calc.component.html',
  styles: [],
})
export class NumeraryCalcComponent extends BasePage implements OnInit {
  form: FormGroup;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  settings1 = { ...this.settings, actions: false };
  data2: any[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;

  settings2 = { ...this.settings, actions: false };
  data3: any[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REQUESTS_COLUMNS,
    };
    this.settings1.columns = GOODS_COLUMNS;
    this.settings2.columns = TOTALS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      idProcess: [null, Validators.required],
      date: [null, Validators.required],

      concept: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      devolution: [null, Validators.required],
      decomiso: [null, Validators.required],
      abandono: [null, Validators.required],
      totalInterests: [null, Validators.required],
      currency: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      bankComision: [null, Validators.required],
      totalImport: [null, Validators.required],
    });
  }
}

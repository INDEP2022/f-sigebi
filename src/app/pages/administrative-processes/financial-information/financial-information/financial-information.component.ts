import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  FINANCIAL_INFORMATION_COLUMNS1,
  FINANCIAL_INFORMATION_COLUMNS2,
} from './financial-information-columns';

@Component({
  selector: 'app-financial-information',
  templateUrl: './financial-information.component.html',
  styles: [],
})
export class FinancialInformationComponent extends BasePage implements OnInit {
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
      columns: FINANCIAL_INFORMATION_COLUMNS1,
    };
    this.settings.columns = FINANCIAL_INFORMATION_COLUMNS2;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, Validators.required],
      date: [null, Validators.required],
      dictaminatedBy: [null, Validators.required],
      avaluo: [null, Validators.required],
      observations: [null, Validators.required],
    });
  }
}

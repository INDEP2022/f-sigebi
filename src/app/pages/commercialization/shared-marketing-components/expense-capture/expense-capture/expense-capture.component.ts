import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

import { EXPENSE_CAPTURE_BILLS_COLUMNS } from './expense-captura-bills-columns';
import { EXPENSE_CAPTURE_INCOME_COLUMNS } from './expense-captura-income-columns';

@Component({
  selector: 'app-expense-capture',
  templateUrl: './expense-capture.component.html',
  styles: [],
})
export class ExpenseCaptureComponent extends BasePage implements OnInit {
  settings1 = {
    ...this.settings,
    actions: false,
  };
  settings2 = {
    ...this.settings,
    actions: false,
  };

  list1: any;
  list2: any;

  form: FormGroup = new FormGroup({});
  ngOnInit(): void {
    this.prepareForm();
  }

  constructor(private fb: FormBuilder) {
    super();
    this.settings1.columns = EXPENSE_CAPTURE_INCOME_COLUMNS;
    this.settings2.columns = EXPENSE_CAPTURE_BILLS_COLUMNS;
  }

  private prepareForm() {
    this.form = this.fb.group({
      idSpent: ['', [Validators.required]],
      concept: ['', [Validators.required]],
      paymentResquest: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      exchange: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      idEvent: ['', [Validators.required]],
      idAllotment: ['', [Validators.required]],
      idCtmFolio: ['', [Validators.required]],
      datResol: ['', [Validators.required]],
      idSupplier: ['', [Validators.required]],
      service: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      regCoor: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      noDoc: ['', [Validators.required]],
      docDate: ['', [Validators.required]],
      payDate: ['', [Validators.required]],
      capDate: ['', [Validators.required]],
      recDate: ['', [Validators.required]],
      noVoucher: ['', [Validators.required]],
      attDoc: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      month: ['', [Validators.required]],
      tc: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      PayMeth: ['', [Validators.required]],
      proofName: ['', [Validators.required]],
      idCapture: ['', [Validators.required]],
      idAuth: ['', [Validators.required]],
      idSol: ['', [Validators.required]],
      dateAdmon: ['', [Validators.required]],
      scanFol: [
        '',
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
    });
  }
}

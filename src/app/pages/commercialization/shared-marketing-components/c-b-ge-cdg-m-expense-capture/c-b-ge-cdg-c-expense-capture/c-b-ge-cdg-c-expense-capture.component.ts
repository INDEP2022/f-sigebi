import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BasePage } from 'src/app/core/shared/base-page';

import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { EXPENSE_CAPTURE_BILLS_COLUMNS } from './expense-captura-bills-columns';
import { EXPENSE_CAPTURE_INCOME_COLUMNS } from './expense-captura-income-columns';

@Component({
  selector: 'app-c-b-ge-cdg-c-expense-capture',
  templateUrl: './c-b-ge-cdg-c-expense-capture.component.html',
  styles: [
  ]
})
export class CBGeCdgCExpenseCaptureComponent extends BasePage implements OnInit {
  settings1 = {
    ...TABLE_SETTINGS,
    actions: false
  };
  settings2 = {
    ...TABLE_SETTINGS,
    actions: false
  };

  list1 : any;
  list2: any;

  form: FormGroup = new FormGroup({}); 
  ngOnInit(): void {
    this.prepareForm();
  }

  constructor(private fb: FormBuilder){
    super();
    this.settings1.columns = EXPENSE_CAPTURE_INCOME_COLUMNS;
    this.settings2.columns = EXPENSE_CAPTURE_BILLS_COLUMNS;
  }

  private prepareForm() {
    this.form = this.fb.group({
      idSpent: ['', [Validators.required]],
      concept: ['', [Validators.required]],
      paymentResquest: ['', [Validators.required]],
      exchange: ['', [Validators.required]],
      idEvent: ['', [Validators.required]],
      idAllotment: ['', [Validators.required]],
      idCtmFolio: ['', [Validators.required]],
      datResol: ['', [Validators.required]],
      idSupplier: ['', [Validators.required]],
      service: ['', [Validators.required]],
      regCoor: ['', [Validators.required]],
      noDoc: ['', [Validators.required]],
      docDate: ['', [Validators.required]],
      payDate: ['', [Validators.required]],
      capDate: ['', [Validators.required]],
      recDate: ['', [Validators.required]],
      noVoucher: ['', [Validators.required]],
      attDoc: ['', [Validators.required]],
      month: ['', [Validators.required]],
      tc: ['', [Validators.required]],
      PayMeth: ['', [Validators.required]],
      proofName: ['', [Validators.required]],
      idCapture: ['', [Validators.required]],
      idAuth: ['', [Validators.required]],
      idSol: ['', [Validators.required]],
      dateAdmon: ['', [Validators.required]],
      scanFol: ['', [Validators.required]],

    });
  }
}

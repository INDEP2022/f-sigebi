import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

import { DONATION_APPROVAL_COLUMNS } from './donation-approval-columns';

@Component({
  selector: 'app-pe-ad-c-donation-approval',
  templateUrl: './pe-ad-c-donation-approval.component.html',
  styles: [],
})
export class PeAdCDonationApprovalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...DONATION_APPROVAL_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idExp: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      preInquiry: [null],
      criminalCase: [null],
      circumstAct: [null],
      touchPenalty: [null],
    });
  }

  data = [
    {
      noBien: 1448,
      description: 'CUARENTA Y DOS CHAMARRAS',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      passed: true,
      status: 'ADE',
      extraDom: 'DECOMISO',
    },
    {
      noBien: 1449,
      description: 'SETENTA Y DOS CELULARES',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      passed: false,
      status: 'ADE',
      extraDom: 'DECOMISO',
    },
    {
      noBien: 1450,
      description: 'CUARENTA Y TRES CABLES USB',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      passed: true,
      status: 'ADE',
      extraDom: 'DECOMISO',
    },
  ];
}

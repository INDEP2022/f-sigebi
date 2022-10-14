import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      preInquiry: ['', [Validators.required]],
      criminalCase: ['', [Validators.required]],
      circumstAct: ['', [Validators.required]],
      touchPenalty: ['', [Validators.required]],
    });
  }

  data = [
    {
      noBien: 1448,
      description: 'CUARENTA Y DOS CHAMARRAS',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      status: 'ADE',
      extraDom: 'DECOMISO',
    },
    {
      noBien: 1449,
      description: 'SETENTA Y DOS CELULARES',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      status: 'ADE',
      extraDom: 'DECOMISO',
    },
    {
      noBien: 1450,
      description: 'CUARENTA Y TRES CABLES USB',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',

      status: 'ADE',
      extraDom: 'DECOMISO',
    },
  ];
}

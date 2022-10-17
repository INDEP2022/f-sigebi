import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { ASSETS_DESTRUCTION_COLUMLNS } from './authorization-assets-destruction-columns';

@Component({
  selector: 'app-pe-ad-c-authorization-assets-destruction',
  templateUrl: './pe-ad-c-authorization-assets-destruction.component.html',
  styles: [],
})
export class PeAdCAuthorizationAssetsDestructionComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = ASSETS_DESTRUCTION_COLUMLNS;
    this.settings.actions = false;
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
      noAuth: [null],
      authNotice: [null],
      fromDate: [null],
      scanFolio: [null],
      cancelSheet: [null],
    });
  }

  data = [
    {
      noBien: 1448,
      description: 'CUARENTA Y DOS CHAMARRAS',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      passed: true,
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      status: 'ADE',
      extraDom: 'DECOMISO',
    },
    {
      noBien: 1449,
      description: 'SETENTA Y DOS CELULARES',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      passed: true,
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      status: 'ADE',
      extraDom: 'DECOMISO',
    },
    {
      noBien: 1450,
      description: 'CUARENTA Y TRES CABLES USB',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      passed: false,
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      status: 'ADE',
      extraDom: 'DECOMISO',
    },
  ];
}

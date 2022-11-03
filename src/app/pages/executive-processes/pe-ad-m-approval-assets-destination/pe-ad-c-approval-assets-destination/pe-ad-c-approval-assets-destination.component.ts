import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { ASSETS_DESTINATION_COLUMNS } from './approval-assets-destination-columns';

@Component({
  selector: 'app-pe-ad-c-approval-assets-destination',
  templateUrl: './pe-ad-c-approval-assets-destination.component.html',
  styleUrls: ['./pe-ad-c-approval-assets-destination.scss'],
})
export class PeAdCApprovalAssetsDestinationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  show = false;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: { ...ASSETS_DESTINATION_COLUMNS },
      rowClassFunction: function (row: {
        data: { availability: any };
      }): 'available' | 'not-available' {
        return row.data.availability ? 'available' : 'not-available';
      },
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
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      availability: false,
    },
    {
      noBien: 1449,
      description: 'SETENTA Y DOS CELULARES',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      availability: false,
    },
    {
      noBien: 1450,
      description: 'CUARENTA Y TRES CABLES USB',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      availability: true,
    },
    {
      noBien: 1448,
      description: 'CUARENTA Y DOS CHAMARRAS',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      availability: false,
    },
    {
      noBien: 1449,
      description: 'SETENTA Y DOS CELULARES',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      availability: false,
    },
    {
      noBien: 1450,
      description: 'CUARENTA Y TRES CABLES USB',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      availability: true,
    },
    {
      noBien: 1448,
      description: 'CUARENTA Y DOS CHAMARRAS',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      availability: false,
    },
    {
      noBien: 1449,
      description: 'SETENTA Y DOS CELULARES',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      availability: false,
    },
    {
      noBien: 1450,
      description: 'CUARENTA Y TRES CABLES USB',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      noOficio: 'DG/006/2004',
      fecha: '12/12/2005',
      availability: true,
    },
  ];
}

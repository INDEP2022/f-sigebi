import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ASSETS_DESTINATION_COLUMNS } from './approval-assets-destination-columns';

@Component({
  selector: 'app-approval-assets-destination',
  templateUrl: './approval-assets-destination.component.html',
  styleUrls: ['./approval-assets-destination.scss'],
})
export class ApprovalAssetsDestinationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  show = false;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columns: any[] = [];

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
    this.getPagination();
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
      preInquiry: [null, Validators.pattern(STRING_PATTERN)],
      criminalCase: [null, Validators.pattern(STRING_PATTERN)],
      circumstAct: [null, Validators.pattern(STRING_PATTERN)],
      touchPenalty: [null, Validators.pattern(STRING_PATTERN)],
    });
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
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

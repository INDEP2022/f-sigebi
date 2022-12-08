import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

import { DONATION_APPROVAL_COLUMNS } from './donation-approval-columns';

@Component({
  selector: 'app-donation-approval',
  templateUrl: './donation-approval.component.html',
  styleUrls: ['./donation-approval.scss'],
})
export class DonationApprovalComponent extends BasePage implements OnInit {
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
      columns: { ...DONATION_APPROVAL_COLUMNS },
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
      preInquiry: [null],
      criminalCase: [null],
      circumstAct: [null],
      touchPenalty: [null],
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
      status: 'ADE',
      extraDom: 'DECOMISO',
      availability: false,
    },
    {
      noBien: 1449,
      description: 'SETENTA Y DOS CELULARES',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      status: 'ADE',
      extraDom: 'DECOMISO',
      availability: true,
    },
    {
      noBien: 1450,
      description: 'CUARENTA Y TRES CABLES USB',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      status: 'ADE',
      extraDom: 'DECOMISO',
      availability: false,
    },
    {
      noBien: 1448,
      description: 'CUARENTA Y DOS CHAMARRAS',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      status: 'ADE',
      extraDom: 'DECOMISO',
      availability: false,
    },
    {
      noBien: 1449,
      description: 'SETENTA Y DOS CELULARES',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      status: 'ADE',
      extraDom: 'DECOMISO',
      availability: true,
    },
    {
      noBien: 1450,
      description: 'CUARENTA Y TRES CABLES USB',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      status: 'ADE',
      extraDom: 'DECOMISO',
      availability: false,
    },
    {
      noBien: 1448,
      description: 'CUARENTA Y DOS CHAMARRAS',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      status: 'ADE',
      extraDom: 'DECOMISO',
      availability: false,
    },
    {
      noBien: 1449,
      description: 'SETENTA Y DOS CELULARES',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      status: 'ADE',
      extraDom: 'DECOMISO',
      availability: true,
    },
    {
      noBien: 1450,
      description: 'CUARENTA Y TRES CABLES USB',
      ubiExact: 'ALMACEN',
      direction: 'PROLONGACIÓN MORELOS',
      status: 'ADE',
      extraDom: 'DECOMISO',
      availability: false,
    },
  ];
}

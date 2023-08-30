import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  APPRAISALS_COLUMNS,
  DETAIL_APPRAISALS_COLUMNS,
  GOODS_COLUMNS,
} from './table-form';

@Component({
  selector: 'app-form-load-appraisals',
  templateUrl: './form-load-appraisals.component.html',
  styles: [],
})
export class FormLoadAppraisalsComponent extends BasePage implements OnInit {
  constructor() {
    super();
  }
  form: FormGroup;
  maxDate = new Date();
  ///
  dataApraisals: LocalDataSource = new LocalDataSource();
  dataGood: LocalDataSource = new LocalDataSource();
  dataDetailApraisal: LocalDataSource = new LocalDataSource();

  apraisalsSettings = {
    ...APPRAISALS_COLUMNS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
  };
  goodSettings = {
    ...GOODS_COLUMNS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
  };
  detailApraisalsSettings = {
    ...DETAIL_APPRAISALS_COLUMNS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: true,
      delete: true,
    },
  };

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.form = new FormGroup({
      numeroEvento: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      claveProceso: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      fechaEvento: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
    });
  }
  editDetailApraisal(e: any) {}
  deleteDetailApraisal(e: any) {}
}

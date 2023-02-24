import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IViewComerAvaluo } from 'src/app/core/models/ms-appraise/appraise-model';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { APPRAISAL_COLUMNS } from './appraisal-columns';

@Component({
  selector: 'app-appraisal-consultation',
  templateUrl: './appraisal-consultation.component.html',
  styles: [],
})
export class AppraisalConsultationComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  form: FormGroup = new FormGroup({});

  appraisals: IViewComerAvaluo[] = [];

  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;

  show: boolean = false;

  constructor(
    private excelService: ExcelService,
    private fb: FormBuilder,
    private appraiseService: AppraiseService
  ) {
    super();
    this.searchFilter = { field: 'description', operator: SearchFilter.ILIKE };

    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...APPRAISAL_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      idAppraisal: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      statusAppraisal: [null, [Validators.pattern(STRING_PATTERN)]],
      keyAppraisal: [null, [Validators.pattern(STRING_PATTERN)]],
      keyOffice: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      noGood: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      opinion: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getAppraiseByParams(): void {
    this.show = true;
    this.filterParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAppraiseByFilters2());
  }

  getAppraiseByFilters2(): void {
    if (this.show) this.filterParams.getValue().removeAllFilters();
    this.filterField();
    this.appraiseService
      .getAppraiseByFilters(this.filterParams.getValue().getParams())
      .subscribe({
        next: response => {
          this.show = false;
          this.appraisals = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  filterField() {
    this.form.controls['idEvent'].value
      ? this.filterParams
          .getValue()
          .addFilter('idEvent', this.form.get('idEvent').value)
      : null;
    this.form.controls['idAppraisal'].value
      ? this.filterParams
          .getValue()
          .addFilter('idAppraisal', this.form.get('idAppraisal').value)
      : null;
    this.form.controls['statusAppraisal'].value
      ? this.filterParams
          .getValue()
          .addFilter('statusAppraisal', this.form.get('statusAppraisal').value)
      : null;
    this.form.controls['keyAppraisal'].value
      ? this.filterParams
          .getValue()
          .addFilter('keyAppraisal', this.form.get('keyAppraisal').value)
      : null;
    this.form.controls['keyOffice'].value
      ? this.filterParams
          .getValue()
          .addFilter('keyOffice', this.form.get('keyOffice').value)
      : null;
    this.form.controls['statusAppraisal'].value
      ? this.filterParams
          .getValue()
          .addFilter('statusAppraisal', this.form.get('statusAppraisal').value)
      : null;
    this.form.controls['noGood'].value
      ? this.filterParams
          .getValue()
          .addFilter('noGood', this.form.get('noGood').value)
      : null;
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.appraisals, 'Consulta_Avaluos');
  }
}

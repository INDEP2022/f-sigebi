import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  VALUATION_REQUEST_COLUMNS,
  VALUATION_REQUEST_COLUMNS_TWO,
} from './valuation-request-columns';

@Component({
  selector: 'app-valuation-request',
  templateUrl: './valuation-request.component.html',
  styles: [],
})
export class valuationRequestComponent extends BasePage implements OnInit {
  form: FormGroup;
  formTwo: FormGroup;

  formDialogOne: FormGroup;

  data: LocalDataSource = new LocalDataSource();
  dataTwo: LocalDataSource = new LocalDataSource();
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  dateNow: Date;
  intervalId: any;
  listCitys: any;
  listKeyOffice: any;
  settingsTwo: any;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS },
    };

    this.settingsTwo = {
      ...this.settings,
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS_TWO },
    };
  }

  ngOnInit() {
    this.prepareForm();
    this.actualizarHora();
    this.intervalId = setInterval(() => {
      this.actualizarHora();
    }, 1000);
  }

  actualizarHora(): void {
    this.dateNow = new Date();
  }

  prepareForm() {
    this.form = this.fb.group({
      event: [null],
      cveService: [null],
      fol: [null],
      key: [null],
      cityCi: [null],
      dateRec: [null],
      dateEla: [null],
      remi: [null],
      dest: [null],
    });
    this.formTwo = this.fb.group({
      allGood: [null],
      selectedGood: [null],
      ref: [null],
      aten: [null],
      espe: [null],
    });
    this.formDialogOne = this.fb.group({
      noti: [null],
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

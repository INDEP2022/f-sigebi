import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
import { data } from './data';
//XLSX
import { ExcelService } from 'src/app/common/services/excel.service';

@Component({
  selector: 'app-mandate-income-reports',
  templateUrl: './mandate-income-reports.component.html',
  styles: [],
})
export class MandateIncomeReportsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  dataOI: any[] = data;
  selectedRows: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  //Range Picker
  dateSelected?: (Date | undefined)[];
  selectedClass: any[] = [];
  maxDate = new Date(new Date().getFullYear(), 11);
  minDate = new Date(new Date().getFullYear(), 0);

  constructor(private fb: FormBuilder, private excelService: ExcelService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data.load(this.dataOI);
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      batch: [null, [Validators.required]],
      event: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      capturingUser: [null, [Validators.required]],
      authorizingUser: [null, [Validators.required]],
      requestingUser: [null, [Validators.required]],
      incomeOrder: [null, [Validators.required]],
      reportNumber: [null, [Validators.required]],
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  onUserRowSelect($event: any) {
    this.selectedRows = $event.selected;
  }

  exportAsXLSX(name: string): void {
    this.excelService.exportAsExcelFile(this.selectedRows, name);
  }
}

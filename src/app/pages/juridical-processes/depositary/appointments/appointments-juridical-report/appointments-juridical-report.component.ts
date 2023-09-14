import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS_APPOINTMENT_JURIDICAL_REPORT } from './appointments-juridical-report.columns';

@Component({
  selector: 'app-appointments-juridical-report',
  templateUrl: './appointments-juridical-report.component.html',
  styles: [],
})
export class AppointmentsJuridicalReportComponent
  extends BasePage
  implements OnInit
{
  @Input() depositaryNumber: number = null;
  settingsTable = { ...this.settings };
  dataTable: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  loadingTable: boolean = false;
  tableParams = new BehaviorSubject<ListParams>(new ListParams());
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private datePipe: DatePipe,
    private msDepositaryService: MsDepositaryService
  ) {
    super();
    this.settingsTable = {
      ...this.settingsTable,
      actions: {
        edit: false,
        add: false,
        delete: false,
      },
      hideSubHeader: true,
      columns: { ...COLUMNS_APPOINTMENT_JURIDICAL_REPORT },
    };
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      dateRepo: [{ value: null, disabled: false }, [Validators.maxLength(11)]], //*
      report: [
        { value: null, disabled: false },
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ], //*
    });
    this.tableParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataTable());
  }

  close() {
    this.modalRef.hide();
  }

  cleanDate() {
    // this.formGroup.get('dateRepo').reset();
    this.formGroup.reset();
  }

  searchWithFilters() {
    console.log('FORMA VALUES ', this.formGroup.value);
    let fieldFull: number = 0;
    if (this.formGroup.get('dateRepo').value) {
      fieldFull++;
    }
    if (this.formGroup.get('report').value) {
      fieldFull++;
    }
    console.log(fieldFull);
    if (fieldFull == 0) {
      // this.alert('warning', 'Ingresa por lo menos un filtro de búsqueda', '');
      this.formGroup.reset();
      // return;
    }
    this.getDataTable();
  }

  getDataTable() {
    this.loadingTable = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('appointmentNum', this.depositaryNumber);
    console.log(this.formGroup.get('dateRepo'));

    if (
      this.formGroup.get('dateRepo').valid &&
      this.formGroup.get('dateRepo').value
    ) {
      let dateRepo = this.datePipe.transform(
        this.formGroup.get('dateRepo').value,
        'yyyy-MM-dd'
      );
      console.log(dateRepo);
      params.addFilter('dateRepo', dateRepo);
    }
    params.addFilter('reportKey', 1);
    if (
      this.formGroup.get('report').valid &&
      this.formGroup.get('report').value
    ) {
      params.addFilter(
        'report',
        this.formGroup.get('report').value,
        SearchFilter.ILIKE
      );
    }
    params.limit = this.tableParams.value.limit;
    params.page = this.tableParams.value.page;
    params['sortBy'] = 'dateRepo:DESC';
    this.msDepositaryService
      .getAllFilteredDepositaryDetrepo(params.getParams())
      .subscribe({
        next: res => {
          console.log('DATA ', res);
          this.totalItems = res.count;
          this.dataTable.load(res.data);
          this.dataTable.refresh();
          this.loadingTable = false;
        },
        error: error => {
          console.log(error);
          this.dataTable.load([]);
          this.dataTable.refresh();
          this.loadingTable = false;
        },
      });
  }
}

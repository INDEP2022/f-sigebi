import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS_APPOINTMENT_RELATIONS_PAYS } from './appointments-relations-pays.columns';

@Component({
  selector: 'app-appointments-relations-pays',
  templateUrl: './appointments-relations-pays.component.html',
  styles: [],
})
export class AppointmentsRelationsPaysComponent
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
      columns: { ...COLUMNS_APPOINTMENT_RELATIONS_PAYS },
    };
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      datePay: [{ value: null, disabled: false }, [Validators.maxLength(11)]], //*
      conceptPayKey: [
        { value: null, disabled: false },
        [Validators.maxLength(11), Validators.pattern(NUM_POSITIVE)],
      ], //*
      description: [
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

  searchWithFilters() {
    console.log('FORMA VALUES ', this.formGroup.value);

    if (
      this.formGroup.get('datePay').invalid ||
      !this.formGroup.get('datePay').value
      //  ||
      // this.formGroup.get('description').value
    ) {
      this.alert('warning', 'Ingresa por lo menos un filtro de búsqueda', '');
      return;
    }
    this.getDataTable();
  }

  getDataTable() {
    this.loadingTable = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('appointmentNumber', this.depositaryNumber);
    console.log(this.formGroup.get('datePay'));

    if (
      this.formGroup.get('datePay').valid &&
      this.formGroup.get('datePay').value
    ) {
      let datePay = this.datePipe.transform(
        this.formGroup.get('datePay').value,
        'yyyy-dd-MM'
      );
      console.log(datePay);
      params.addFilter('datePay', datePay);
    }
    if (
      this.formGroup.get('conceptPayKey').valid &&
      this.formGroup.get('conceptPayKey').value
    ) {
      params.addFilter(
        'conceptPayKey',
        this.formGroup.get('conceptPayKey').value
      );
    }
    if (
      this.formGroup.get('description').valid &&
      this.formGroup.get('description').value
    ) {
      params.addFilter(
        'conceptPay.description',
        this.formGroup.get('description').value
      );
    }
    params.limit = this.tableParams.value.limit;
    params.page = this.tableParams.value.page;
    this.msDepositaryService
      .getAllFilteredDepositaryPaymentDet(params.getParams())
      .subscribe({
        next: res => {
          console.log('DATA ', res);
          let dataResponse = res.data.map((i: any) => {
            i['payConcept'] = i.conceptPayKey + ' DESCRIPCION';
            // i.i.menaje && i.good
            //   ? (i.good['menaje'] = i.menaje['noGoodMenaje'])
            //   : '';
            return i;
          });
          this.totalItems = res.count;
          this.dataTable.load(dataResponse);
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

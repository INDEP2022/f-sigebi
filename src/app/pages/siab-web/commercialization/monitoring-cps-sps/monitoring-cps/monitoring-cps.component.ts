import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-monitoring-cps',
  templateUrl: './monitoring-cps.component.html',
  styles: [],
})
export class monitoringCpsComponent extends BasePage implements OnInit {
  //

  // Date Picker Only Year
  override minMode: BsDatepickerViewMode = 'year'; // change for month:year

  // Form
  form: FormGroup;

  // Date
  today: Date;
  maxDate: Date;
  minDate: Date;

  // Boolean
  show: boolean = false;
  checkedSiab: boolean = false;

  // Array Ngx-Select
  @Input() fullEvents: any;
  @Output() fullOutputEvents = new EventEmitter<any>();

  // Data Table
  @Output() dataSiabParamsFilter = new EventEmitter<any>();
  @Output() dataSirsaeParamsFilter = new EventEmitter<any>();

  //

  constructor(
    private fb: FormBuilder,
    private serviceEvents: ComerEventosService,
    private servicePipe: DatePipe
  ) {
    super();
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }

  ngOnInit(): void {
    this.prepareForm();
    this.bsConfig = Object.assign(
      {},
      {
        minMode: this.minMode,
      }
    );
    this.fullComercialEvents();
  }

  //

  fullComercialEvents(params?: ListParams) {
    let paramsLocal = new HttpParams();
    paramsLocal = paramsLocal.append('limit', params?.limit);
    paramsLocal = paramsLocal.append('page', params?.page);
    if (params?.text != '') {
      paramsLocal = paramsLocal.append(
        'filter.idevento',
        '$eq:' + params?.text
      );
    }
    this.serviceEvents.getEvents(paramsLocal).subscribe({
      next: response => {
        this.fullEvents = new DefaultSelect(response.data, response.count || 0);
      },
      error: data => {
        this.fullEvents = new DefaultSelect([], 0);
      },
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      radioOne: [null],
      radioTwo: [null],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      year: [null, [Validators.required]],
      event: [null, [Validators.required]],
    });
  }

  data: any;
  data2: any;

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
  }

  siabCheckedChanged() {
    this.checkedSiab = true;
    this.form.get('year').disable();
  }

  sirsaeCheckedChanged() {
    this.form.get('event').disable();
  }

  fullTableSiabOrSirsae() {
    if (this.checkedSiab == true) {
      this.fullSiab();
    } else {
      this.fullSirsae();
    }
  }

  fullSiab() {
    let params = new HttpParams();
    params = params.append(
      'eventId',
      this.form.controls['event'].value?.idevento
    );
    params = params.append(
      'startDate',
      this.servicePipe.transform(this.form.controls['from'].value, 'dd/MM/yyyy')
    );
    params = params.append(
      'endDate',
      this.servicePipe.transform(this.form.controls['to'].value, 'dd/MM/yyyy')
    );
    params = params.append('system', 'SIAB');
    this.dataSiabParamsFilter.emit(params);
  }

  fullSirsae() {
    let params = new HttpParams();
    params = params.append('eventId', 0);
    params = params.append('startDate', '');
    params = params.append('endDate', '');
    params = params.append('system', 'SIRSAE');
    this.dataSiabParamsFilter.emit(params);
  }

  resetForm() {
    this.form.get('year').enable();
    this.form.get('event').enable();
    this.form.reset();
  }

  //
}

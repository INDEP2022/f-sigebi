import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-monitoring-sps',
  templateUrl: './monitoring-sps.component.html',
  styles: [],
})
export class monitoringSpsComponent extends BasePage implements OnInit {
  //

  override minMode: BsDatepickerViewMode = 'year'; // change for month:year

  form: FormGroup;
  formTwo: FormGroup;
  today: Date;
  maxDate: Date;
  minDate: Date;

  show: boolean = false;

  // Array Ngx-Select
  concepts = new DefaultSelect();
  eventsExpenses = new DefaultSelect();

  //

  constructor(
    private fb: FormBuilder,
    private serviceConcepts: ParametersConceptsService,
    private serviceEvents: ComerEventosService
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
    this.fullConcepts();
    this.fullEventsExpenses();
  }

  //

  private prepareForm() {
    this.form = this.fb.group({
      from: [null],
      to: [null],
      year: [null],
      event: [null],
    });
    this.formTwo = this.fb.group({
      concepts: [null],
    });
  }

  fullConcepts(params?: ListParams) {
    this.serviceConcepts.getConcepts(params).subscribe({
      next: response => {
        this.concepts = new DefaultSelect(response.data, response.count | 0);
      },
      error: response => {
        this.concepts = new DefaultSelect([], 0);
      },
    });
  }

  fullEventsExpenses(params?: ListParams) {
    let paramsLocal = new HttpParams();
    paramsLocal = paramsLocal.append('limit', params?.limit);
    paramsLocal = paramsLocal.append('page', params?.page);
    if (params?.text != '') {
      paramsLocal = paramsLocal.append(
        'filter.idevento',
        '$eq:' + params?.text
      );
    }
    this.serviceEvents.getEventsExpenses(paramsLocal).subscribe({
      next: response => {
        this.eventsExpenses = new DefaultSelect(
          response.data,
          response.count | 0
        );
      },
      error: response => {
        this.concepts = new DefaultSelect([], 0);
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }
}

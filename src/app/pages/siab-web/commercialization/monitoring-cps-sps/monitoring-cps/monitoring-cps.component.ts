import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  MONITORING_CPS_SIAB,
  MONITORING_CPS_SIRSAE,
} from './monitoring-cps-columns';

@Component({
  selector: 'app-monitoring-cps',
  templateUrl: './monitoring-cps.component.html',
  styles: [],
})
export class monitoringCpsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  today: Date;
  maxDate: Date;
  minDate: Date;

  show: boolean = false;

  settings2 = {
    ...this.settings,
    actions: false,
  };

  constructor(private fb: FormBuilder) {
    super();
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);

    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...MONITORING_CPS_SIAB },
    };

    this.settings2.columns = MONITORING_CPS_SIRSAE;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      radio: [null, [Validators.required]],
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
    });
  }

  data: any;
  data2: any;

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }
}

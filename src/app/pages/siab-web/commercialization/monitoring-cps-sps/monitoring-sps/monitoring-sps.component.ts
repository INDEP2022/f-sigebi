import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { MONITORING_CPS_BILLS } from './monitoring-sps-columns';

@Component({
  selector: 'app-monitoring-sps',
  templateUrl: './monitoring-sps.component.html',
  styles: [],
})
export class monitoringSpsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  today: Date;
  maxDate: Date;
  minDate: Date;

  show: boolean = false;

  constructor(private fb: FormBuilder) {
    super();

    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);

    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...MONITORING_CPS_BILLS },
    };
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

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  data: any;
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  APPRAISAL_CHARGE,
  APPRAISAL_CHARGE_DETAILS,
  APPRAISAL_CHARGE_GOODS,
} from './appraisal-charge-columns';

@Component({
  selector: 'app-sw-comer-c-appraisal-charge',
  templateUrl: './sw-comer-c-appraisal-charge.component.html',
  styles: [],
})
export class SwComerCAppraisalChargeComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  settings2 = {
    ...this.settings,
    actions: false,
    selectMode: 'multi',
  };

  settings3 = {
    ...this.settings,
    actions: false,
    selectMode: 'multi',
  };

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...APPRAISAL_CHARGE },
    };

    this.settings2.columns = APPRAISAL_CHARGE_GOODS;

    this.settings3.columns = APPRAISAL_CHARGE_DETAILS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noEvent: [null, [Validators.required]],
      cveProcess: [null, [Validators.required]],
      eventDate: [null, [Validators.required, maxDate(new Date())]],
      observations: [null, [Validators.required]],

      appliDate: [null, [Validators.required, maxDate(new Date())]],
      type: [null, [Validators.required]],
      status: [null, [Validators.required]],
      reference: [null, [Validators.required]],
    });
  }

  data: any;
}

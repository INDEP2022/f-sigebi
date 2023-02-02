import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CALCULATE_COMISSION_COLUMNS } from './caculate-comission-columns';

@Component({
  selector: 'app-calculate-commission',
  templateUrl: './calculate-commission.component.html',
  styles: [],
})
export class CalculateCommissionComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data: any;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...CALCULATE_COMISSION_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idName: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      idEvent: ['', [Validators.required]],
      typeChange: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { GRV_DETALLES_COLUMNS, GV_LOTES_COLUMNS } from './columns';

@Component({
  selector: 'app-batch-status-monitoring',
  templateUrl: './batch-status-monitoring.component.html',
  styles: [],
})
export class BatchStatusMonitoringComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});

  show: boolean = false;
  show2: boolean = false;

  settings2 = {
    ...this.settings,
    actions: false,
  };

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...GRV_DETALLES_COLUMNS },
    };

    this.settings2.columns = GV_LOTES_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareForm2();
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeGood: [null, [Validators.required]],
      event: [null, [Validators.required]],
      transferee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      allotment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  private prepareForm2() {
    this.form2 = this.fb.group({
      radio: [null, [Validators.required]],
    });
  }

  chargeFile(event: any) {}

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  data: any;
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { UNEXPOSED_GOODS_COLUMNS } from './columns';

@Component({
  selector: 'app-report-exposure-for-sale',
  templateUrl: './report-exposure-for-sale.component.html',
  styles: [],
})
export class ReportExposureForSaleComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  show: boolean = false;

  get filterGoods() {
    return this.form.get('filterGoods');
  }

  get filterText() {
    return this.form.get('filterText');
  }

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...UNEXPOSED_GOODS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeGood: [],
      filterGoods: [],
      filterText: [],
      subtype: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  chargeFile(event: any) {}

  data: any;
}

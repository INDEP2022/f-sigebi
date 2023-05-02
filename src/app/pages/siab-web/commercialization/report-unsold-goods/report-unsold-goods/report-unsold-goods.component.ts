import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { GOODS_COLUMNS } from './columns';

@Component({
  selector: 'app-report-unsold-goods',
  templateUrl: './report-unsold-goods.component.html',
  styles: [],
})
export class ReportUnsoldGoodsComponent extends BasePage implements OnInit {
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
      columns: { ...GOODS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeGood: [null, [Validators.required]],
      subtype: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      startDate: [null, [Validators.required, maxDate(new Date())]],
      filterGoods: [],
      filterText: [],
    });
  }

  data: any;

  chargeFile(event: any) {}
}

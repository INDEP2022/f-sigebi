import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-pe-cmrd-c-cumulative-goods',
  templateUrl: './pe-cmrd-c-cumulative-goods.component.html',
  styles: [
  ]
})
export class PeCmrdCCumulativeGoodsComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 
  select = new DefaultSelect();

  bsValueYear: Date = new Date();
  minModeYear: BsDatepickerViewMode = 'year'; // change for month:year
  bsConfigYear: Partial<BsDatepickerConfig>;

  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month'; // change for month:year
  bsConfigFromMonth: Partial<BsDatepickerConfig>;

  bsValueToMonth: Date = new Date();
  minModeToMonth: BsDatepickerViewMode = 'month'; // change for month:year
  bsConfigToMonth: Partial<BsDatepickerConfig>;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
    this.bsConfigYear = Object.assign({}, {
      minMode : this.minModeYear,
      dateInputFormat: 'YYYY'
    });
    this.bsConfigFromMonth = Object.assign({}, {
      minMode : this.minModeFromMonth,
      dateInputFormat: 'MMMM'
    });
    this.bsConfigToMonth = Object.assign({}, {
      minMode : this.minModeFromMonth,
      dateInputFormat: 'MMMM'
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      subdelegation: ['', [Validators.required]],
      fromYear: [this.bsValueYear, [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(NUMBERS_PATTERN), Validators.min(1950), Validators.max(2022)]],
      toMonth: [this.bsValueToMonth, [Validators.required]],
      fromMonth: [this.bsValueFromMonth, [Validators.required]],
    });
  }

}

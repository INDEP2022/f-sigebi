import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-pe-aab-c-annual-accumulated-assets',
  templateUrl: './pe-aab-c-annual-accumulated-assets.component.html',
  styles: [],
})
export class PeAabCAnnualAccumulatedAssetsComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();

  bsValueToYear: Date = new Date();
  minModeToYear: BsDatepickerViewMode = 'year'; // change for month:year
  bsConfigToYear: Partial<BsDatepickerConfig>;

  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year'; // change for month:year
  bsConfigFromYear: Partial<BsDatepickerConfig>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
    this.bsConfigToYear = Object.assign(
      {},
      {
        minMode: this.minModeToYear,
        dateInputFormat: 'YYYY',
      }
    );
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      subdelegation: ['', [Validators.required]],
      fromYear: [this.bsValueFromYear, [Validators.required]],
      toYear: [this.bsValueToYear, [Validators.required]],
    });
  }
}

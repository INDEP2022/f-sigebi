import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-pe-rdde-c-daily-control-reception',
  templateUrl: './pe-rdde-c-daily-control-reception.component.html',
  styles: [],
})
export class PeRddeCDailyControlReceptionComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();

  bsValue: Date = new Date();
  minMode: BsDatepickerViewMode = 'month'; // change for month:year
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
    this.bsConfig = Object.assign(
      {},
      {
        minMode: this.minMode,
        dateInputFormat: 'MMMM/YYYY',
      }
    );
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      subdelegation: ['', [Validators.required]],
      //fromYear: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(NUMBERS_PATTERN), Validators.min(1950), Validators.max(2022)]],
      monthYear: [this.bsValue, [Validators.required]],
    });
  }
}

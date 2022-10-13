import { Component, OnInit } from '@angular/core';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-pe-atb-c-quarterly-accumulated-assets',
  templateUrl: './pe-atb-c-quarterly-accumulated-assets.component.html',
  styles: [
  ]
})
export class PeAtbCQuarterlyAccumulatedAssetsComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 
  select = new DefaultSelect();

  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month'; // change for month:year
  bsConfigFromMonth: Partial<BsDatepickerConfig>;

  bsValueToMonth: Date = new Date();
  minModeToMonth: BsDatepickerViewMode = 'month'; // change for month:year
  bsConfigToMonth: Partial<BsDatepickerConfig>;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
    this.bsConfigFromMonth = Object.assign({}, {
      minMode : this.minModeFromMonth,
      dateInputFormat: 'MMMM/YYYY'
    });
    this.bsConfigToMonth = Object.assign({}, {
      minMode : this.minModeFromMonth,
      dateInputFormat: 'MMMM/YYYY'
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      subdelegation: ['', [Validators.required]],
      fromMonth: [this.bsValueFromMonth, [Validators.required]],
      toMonth: [this.bsValueToMonth, [Validators.required]],
    });
    
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  GENERAL_PROCESSES_TECHNICAL_DATASHEET_COLUNNS,
  GENERAL_PROCESSES_TECHNICAL_DATASHEET_DATA,
} from './technical-datasheet-columns';

@Component({
  selector: 'app-technical-datasheet',
  templateUrl: './technical-datasheet.component.html',
  styles: [],
})
export class TechnicalDatasheetComponent extends BasePage implements OnInit {
  data = GENERAL_PROCESSES_TECHNICAL_DATASHEET_DATA;
  form = this.fb.group({
    year: [null, [Validators.required]],
    month: [null, [Validators.required]],
    usuario: [null, [Validators.required]],
    coord: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_PROCESSES_TECHNICAL_DATASHEET_COLUNNS;
  }

  ngOnInit(): void {}
}

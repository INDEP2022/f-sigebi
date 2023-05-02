import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  HISTORICAL_ACCOUNT_STATUS_COLUMNS,
  HISTORICAL_ACCOUNT_STATUS_EXAMPLE_DATA,
} from './account-status-columns';

@Component({
  selector: 'app-account-status',
  templateUrl: './account-status.component.html',
  styles: [],
})
export class AccountStatusComponent extends BasePage implements OnInit {
  data = HISTORICAL_ACCOUNT_STATUS_EXAMPLE_DATA;
  form = this.fb.group({
    fecha: [null, [Validators.required]],
    month: [null, [Validators.required]],
    usuario: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {
    super();
    this.settings.actions = false;
    this.settings.columns = HISTORICAL_ACCOUNT_STATUS_COLUMNS;
  }

  ngOnInit(): void {}
}

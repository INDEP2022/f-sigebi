import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DEPOSIT_TOKENS, NUMERARY_FILE } from './deposit-conciliations-columns';

@Component({
  selector: 'app-deposit-consiliation-tokens',
  templateUrl: './deposit-consiliation-tokens.component.html',
  styles: [],
})
export class DepositConsiliationTokensComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  total = '22,891.26';

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  settings1 = { ...this.settings, actions: false };
  data2: any[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: NUMERARY_FILE,
    };
    this.settings1.columns = DEPOSIT_TOKENS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
      penalCause: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],

      previousAveriguation: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      description: [null, Validators.required],
      status: [null, Validators.required],
    });
  }
}

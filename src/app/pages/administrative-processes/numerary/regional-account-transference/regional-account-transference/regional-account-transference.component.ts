import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { REGIONAL_ACCOUNT_COLUMNS } from './regional-account-columns';

@Component({
  selector: 'app-regional-account-transference',
  templateUrl: './regional-account-transference.component.html',
  styles: [],
})
export class RegionalAccountTransferenceComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  total = '22,891.26';
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REGIONAL_ACCOUNT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, Validators.required],
      idRequest: [null, Validators.required],

      transferenceReport: [null, Validators.required],
      dateReport: [null, Validators.required],

      historicCheck: [null, Validators.required],

      currencyType: [null, Validators.required],
      delegation: [null, Validators.required],
      folioCash: [null, Validators.required],
      transactionDate: [null, Validators.required],

      cveAccount: [null, Validators.required],
      accountType: [null, Validators.required],
      cveBank: [null, Validators.required],
      cveCurrency: [null, Validators.required],
    });
  }
}

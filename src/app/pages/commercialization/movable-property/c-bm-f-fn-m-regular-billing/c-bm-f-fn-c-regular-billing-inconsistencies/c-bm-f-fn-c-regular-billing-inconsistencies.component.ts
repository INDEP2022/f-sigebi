import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { REGULAR_BILLING_INCONSISTENCIES_COLUMNS } from './regular-billing-inconsistencies-columns';

@Component({
  selector: 'app-c-bm-f-fn-c-regular-billing-inconsistencies',
  templateUrl: './c-bm-f-fn-c-regular-billing-inconsistencies.component.html',
  styles: [],
})
export class CBmFFnCRegularBillingInconsistenciesComponent
  extends BasePage
  implements OnInit
{
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...REGULAR_BILLING_INCONSISTENCIES_COLUMNS },
    };
  }

  data = [
    {
      allotment: '207',
      noBien: '',
      exhibit: '',
      siabType: '',
    },
  ];

  ngOnInit(): void {}
}

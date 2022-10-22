import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page'; 
import { REGULAR_BILLING_UNSETTLED_COLUMNS } from './regular-billing-unsettled-columns';

@Component({
  selector: 'app-c-bm-f-fn-c-regular-billing-unsettled',
  templateUrl: './c-bm-f-fn-c-regular-billing-unsettled.component.html',
  styles: [
  ]
})
export class CBmFFnCRegularBillingUnsettledComponent extends BasePage implements OnInit {

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {...REGULAR_BILLING_UNSETTLED_COLUMNS}
    }
  }

  data = [
    {
      allotment: "207",
      situation: "No liquidado"
    },
    {
      allotment: "208",
      situation: "Penalizado"
    },
    {
      allotment: "207",
      situation: "Devuelto"
    }
  ]

  ngOnInit(): void {
  }

}

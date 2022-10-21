import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CBmFFnMRegularBillingRoutingModule } from './c-bm-f-fn-m-regular-billing-routing.module';
import { CBmFFnCRegularBillingInvoiceComponent } from './c-bm-f-fn-c-regular-billing-invoice/c-bm-f-fn-c-regular-billing-invoice.component';
import { CBmFFnCRegularBillingUnsettledComponent } from './c-bm-f-fn-c-regular-billing-unsettled/c-bm-f-fn-c-regular-billing-unsettled.component';
import { CBmFFnCRegularBillingInconsistenciesComponent } from './c-bm-f-fn-c-regular-billing-inconsistencies/c-bm-f-fn-c-regular-billing-inconsistencies.component';


@NgModule({
  declarations: [
    CBmFFnCRegularBillingInvoiceComponent,
    CBmFFnCRegularBillingUnsettledComponent,
    CBmFFnCRegularBillingInconsistenciesComponent
  ],
  imports: [
    CommonModule,
    CBmFFnMRegularBillingRoutingModule
  ],
  exports: [
    CBmFFnCRegularBillingInvoiceComponent,
    CBmFFnCRegularBillingUnsettledComponent,
    CBmFFnCRegularBillingInconsistenciesComponent
  ]
})
export class CBmFFnMRegularBillingModule { }

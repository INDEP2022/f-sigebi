import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { RegularBillingGenerationAssetsComponent } from './regular-billing-generation-assets/regular-billing-generation-assets.component';
import { RegularBillingInconsistenciesComponent } from './regular-billing-inconsistencies/regular-billing-inconsistencies.component';
import { RegularBillingInvoiceComponent } from './regular-billing-invoice/regular-billing-invoice.component';
import { RegularBillingRoutingModule } from './regular-billing-routing.module';
import { RegularBillingUnsettledComponent } from './regular-billing-unsettled/regular-billing-unsettled.component';

@NgModule({
  declarations: [
    RegularBillingInvoiceComponent,
    RegularBillingUnsettledComponent,
    RegularBillingInconsistenciesComponent,
    RegularBillingGenerationAssetsComponent,
  ],
  imports: [
    CommonModule,
    RegularBillingRoutingModule,
    SharedModule,
    EventsSharedComponent,
  ],
  exports: [
    RegularBillingInvoiceComponent,
    RegularBillingUnsettledComponent,
    RegularBillingInconsistenciesComponent,
    RegularBillingGenerationAssetsComponent,
  ],
})
export class RegularBillingModule {}

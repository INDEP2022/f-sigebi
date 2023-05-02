import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';

import { MassBillBaseSalesModule } from '../mass-bill-base-sales/mass-bill-base-sales.module';
import { RegularBillingModule } from '../regular-billing/regular-billing.module';

import { RegularBillingTabRoutingModule } from './regular-billing-tab-routing.module';
import { RegularBillingTabComponent } from './regular-billing-tab/regular-billing-tab.component';

@NgModule({
  declarations: [RegularBillingTabComponent],
  imports: [
    CommonModule,
    RegularBillingTabRoutingModule,
    TabsModule,
    SharedModule,
    MassBillBaseSalesModule,
    RegularBillingModule,
  ],
})
export class RegularBillingTabModule {}

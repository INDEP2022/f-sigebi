import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';

import { CBmFFmdvdbMMassBillBaseSalesModule } from '../c-bm-f-fmdvdb-m-mass-bill-base-sales/c-bm-f-fmdvdb-m-mass-bill-base-sales.module';
import { CBmFFnMRegularBillingModule } from '../c-bm-f-fn-m-regular-billing/c-bm-f-fn-m-regular-billing.module';

import { RegularBillingTabRoutingModule } from './regular-billing-tab-routing.module';
import { RegularBillingTabComponent } from './regular-billing-tab/regular-billing-tab.component';


@NgModule({
  declarations: [
    RegularBillingTabComponent
  ],
  imports: [
    CommonModule,
    RegularBillingTabRoutingModule,
    TabsModule,
    SharedModule,
    CBmFFmdvdbMMassBillBaseSalesModule,
    CBmFFnMRegularBillingModule
  ]
})
export class RegularBillingTabModule { }

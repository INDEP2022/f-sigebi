import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';

import { MassBillBaseSalesModule } from '../mass-bill-base-sales/mass-bill-base-sales.module';

import { MassBilingBaseSalesTabRoutingModule } from './mass-biling-base-sales-tab-routing.module';
import { MassBilingBaseSalesTabComponent } from './mass-biling-base-sales-tab/mass-biling-base-sales-tab.component';

@NgModule({
  declarations: [MassBilingBaseSalesTabComponent],
  imports: [
    CommonModule,
    MassBilingBaseSalesTabRoutingModule,
    TabsModule,
    SharedModule,
    MassBillBaseSalesModule,
  ],
})
export class MassBilingBaseSalesTabModule {}
